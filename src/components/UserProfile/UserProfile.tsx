import { useEffect, useState } from "react";
import { getImage } from "../../common/utils/logoUtils";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../common/config/apiService";
import Swal from "sweetalert2";
import { openWindowTab } from "../../common/helpers/commonHelpers";
import { Tooltip } from "flowbite-react";

interface PlanDetails {
    interval: string;
    start_date: string;
    end_date: string;
}

const UserProfile = () => {
    const navigate = useNavigate();
    const [load, setLoad] = useState<any>(true);
    const [activePlan, setActiveplan] = useState(false);
    const [userDetails, seUserDetails] = useState({
        name: "",
        email: "",
    });
    const [userTrialPlan, setUserTrialPlan] = useState(false)
    const [activePlanDetails, setActiveplanDetails] = useState<PlanDetails>()
    const checkActivePlan = async () => {
        try {
            const requestUrl = apiService.EndPoint.checkActivePlan;
            // Make the API request to check the active plan status
            await apiService.commonAPIRequest(
                requestUrl,
                apiService.Method.get,
                undefined, // No query parameters
                {}, // No request body
                (result: any) => {
                    if (result.data.userDetails.isTrialExpired) {
                        if (result?.status === 200 && result?.data.message === "User does not have an active subscription.") {
                            setActiveplan(false);
                        } else {
                            setActiveplan(true);
                            setActiveplanDetails(result?.data.subscriptions[0])
                        }
                    } else {
                        setActiveplan(true);
                        setUserTrialPlan(true);
                    }
                    seUserDetails({
                        name: result.data.userDetails.name,
                        email: result.data.userDetails.email
                    })
                }
            );
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        checkActivePlan();
    }, []);

    const cancelActivePlan = async () => {
        const confirmAction = await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to cancel your subscription?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff5c35",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, keep it",
        });

        if (!confirmAction.isConfirmed) {
            return; // If the user cancels, do nothing
        }

        try {
            setLoad(true);
            const requestUrl = apiService.EndPoint.cancelActivePlan;

            // Make the API request to cancel the active plan
            await apiService.commonAPIRequest(
                requestUrl,
                apiService.Method.get,
                undefined, // No query parameters
                {}, // No request body
                (result: any) => {
                    if (result?.status === 200 && result?.data.message === "Subscription cancelled successfully") {
                        Swal.fire({
                            icon: "success",
                            title: "Cancelled!",
                            text: "Your subscription has been cancelled successfully.",
                            confirmButtonColor: "#ff5c35",
                        });
                        checkActivePlan(); // Refresh the active plan status
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Failed!",
                            text: result?.message || "Failed to cancel the subscription.",
                            confirmButtonColor: "#ff5c35",
                        });
                    }
                }
            );
        } catch (error) {
            console.error("Error cancelling subscription:", error);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong while cancelling the subscription.",
                confirmButtonColor: "#ff5c35",
            });
        } finally {
            setLoad(false);
        }
    };
    const getCustomePortalLink = async () => {
        try {
            const requestUrl = apiService.EndPoint.getCustomerPortalLink;

            // Make the API request to fetch the customer portal link
            await apiService.commonAPIRequest(
                requestUrl,
                apiService.Method.get,
                undefined, // No query parameters
                {}, // No request body
                (result: any) => {
                    if (result?.data.message === "Customer portal link fetched successfully" && result?.status === 200) {
                        openWindowTab(result?.data.data); // Open the customer portal in a new tab
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching customer portal link:", error);
        }
    };

    return (
        <>
            <div className="c-padding-r pt-24 h-screen relative pl-[280px] pr-[30px]">
                {
                    load ?
                        <div className="flex justify-between gap-5 w-full">
                            <div className="rounded-2xl w-full">
                                <div className="p-5 bg-white g-box g-box-table pt-[15%] pb-[15%] px-0">
                                    <div className="d-table h-connect-table !w-full">
                                        <Loader />
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <>
                            <div className="flex justify-between gap-5 w-full">
                                <div className="rounded-2xl w-full">
                                    <div className="p-5 bg-white g-box g-box-table ">
                                        <div className="d-table h-connect-table !w-full">
                                            <div className="g-box-title">
                                                <h4 className="font-medium mb-3">Profile Setting</h4>
                                            </div>
                                            <div className="mt-6">
                                                <div className="flex items-center space-x-4 mt-4">
                                                    <span className="relative w-16 h-16 border-[#ff5c35] border-[3px] rounded-full overflow-hidden">
                                                        <img src={getImage('user')} alt="img" className="w-full h-full rounded-full object-cover" />
                                                    </span>
                                                    <div>
                                                        <p className="text-lg font-semibold">{userDetails.name ? userDetails.name : ""}</p>
                                                        <p className="text-gray-500">{userDetails.email ? userDetails.email : ""}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between gap-5 w-full mt-5">
                                <div className="rounded-2xl w-full">
                                    <div className="p-5 bg-white g-box g-box-table">
                                        <div className="d-table h-connect-table !w-full">
                                            <div className="g-box-title">
                                                <h4 className="font-medium mb-3">Billing Details</h4>
                                            </div>
                                            <table className="w-full overflow-auto g-table">
                                                <thead>
                                                    {
                                                        userTrialPlan ?
                                                            <tr>
                                                                <th rowSpan={3} className="font-light text-base px-4 color00517C py-3 text-center"><span className="text-base uppercase font-semibold whitespace-nowrap text-center">Active Plan</span></th>
                                                            </tr>
                                                            :
                                                            <tr>
                                                                <th className="font-light text-base px-4 color00517C py-3 text-left">
                                                                    <span className="inline-block connect-table-checkbox float-left relative">
                                                                    </span>
                                                                    <span className="info w-auto block text-left">
                                                                        <span className="text-base uppercase font-semibold whitespace-nowrap">Plan Name</span><br />
                                                                    </span>
                                                                </th>
                                                                <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold whitespace-nowrap">Plan Start Date</span></th>
                                                                <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold whitespace-nowrap">Plan End Date</span></th>
                                                            </tr>
                                                    }
                                                </thead>
                                                <tbody>
                                                    {
                                                        userTrialPlan ?
                                                            <tr>
                                                                <td colSpan={3} className="px-4 py-3 text-green font-bold text-center !text-xl">Enjoy your 3 Day free access!</td>
                                                            </tr>
                                                            :
                                                            !activePlan ?
                                                                <tr>
                                                                    <td colSpan={3} className="px-4 py-3 text-center font-bold text-red">
                                                                        You currently do not have an active plan. Consider upgrading to continue enjoying our services!
                                                                    </td>
                                                                </tr>
                                                                :
                                                                <tr>
                                                                    <td className="px-4 py-3">
                                                                        {activePlanDetails?.interval === "year"
                                                                            ? "Yearly Plan (ACTIVE)"
                                                                            : "Monthly Plan (ACTIVE)"}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {activePlanDetails?.start_date
                                                                            ? new Date(activePlanDetails.start_date).toLocaleDateString()
                                                                            : "N/A"}
                                                                    </td>

                                                                    <td className="px-4 py-3">
                                                                        {activePlanDetails?.end_date
                                                                            ? new Date(activePlanDetails.end_date).toLocaleDateString()
                                                                            : "N/A"}
                                                                    </td>
                                                                </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between gap-5 w-full mt-5">
                                <div className="rounded-2xl w-full">
                                    <div className="p-5 bg-white g-box g-box-table">
                                        <div className="d-table h-connect-table !w-full">
                                            <div className="g-box-title">
                                                <h4 className="font-medium mb-3">Manage your billing here.</h4>
                                                <div className="flex space-x-4 mt-4 items-center">

                                                    {!activePlan ?
                                                        <>
                                                            <span className="text-base">
                                                                Join Now and Explore Everything Evarobo Offers
                                                            </span>
                                                            <Tooltip content="Subscribe to unlock premium features" className="custom-tooltip">
                                                                <button className="background-one border border-color-one text-white px-5 py-3 text-base rounded-lg  hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform" onClick={() => navigate("/pricing")}>Subscribe</button>
                                                            </Tooltip>
                                                        </>
                                                        :
                                                        <>
                                                            <Tooltip content="Manage your current subscription settings" className="custom-tooltip">
                                                                <button
                                                                    className="background-one border border-color-one text-white px-5 py-3 text-base rounded-lg hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform"
                                                                    onClick={getCustomePortalLink}>
                                                                    Manage Subscription
                                                                </button>
                                                            </Tooltip>
                                                            <Tooltip content="Upgrade or downgrade your plan" className="custom-tooltip">
                                                                <button
                                                                    className="background-one border border-color-one text-white px-5 py-3 text-base rounded-lg hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform"
                                                                    onClick={() => navigate("/pricing")}>
                                                                    Upgrade / Downgrade
                                                                </button>
                                                            </Tooltip>
                                                            <Tooltip content="Cancel your current subscription" className="custom-tooltip">
                                                                <button
                                                                    className="background-one border border-color-one text-white px-5 py-3 text-base rounded-lg hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform"
                                                                    onClick={cancelActivePlan}>
                                                                    Cancel Subscription
                                                                </button>
                                                            </Tooltip>
                                                        </>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </div>
        </>
    );
}

export default UserProfile
