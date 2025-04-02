import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { apiService } from "../../common/config/apiService";
import Swal from 'sweetalert2';
import { Tooltip } from "flowbite-react";

const PricingPage = () => {

    const [load, setLoad] = useState(true);
    const [allPlans, setAllPlans] = useState<any>([]);
    const [activePlan, setActiveplan] = useState(false);
    const [activePlanDetails, setActiveplanDetails] = useState<any>([]);

    const checkActivePlan = async () => {
        try {
            await apiService.commonAPIRequest(
                `${apiService.EndPoint.checkActivePlan}`,
                apiService.Method.get,
                undefined,
                {},
                (response: any) => {
                    if (response.status === 200 && response.data.success === false) {
                        setActiveplan(false);
                        setActiveplanDetails([]);
                        return response?.data.message;
                    } else {
                        setActiveplan(true);
                        setActiveplanDetails(response?.data.subscriptions[0]);
                        return response?.data.subscriptions[0];
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoad(false);
        }
    };

    const getAllPlans = async () => {
        try {
            await apiService.commonAPIRequest(
                `${apiService.EndPoint.getAllPlans}`,
                apiService.Method.get,
                undefined,
                {},
                (response: any) => {
                    if (response.status === 200 && response.data) {
                        setAllPlans(response.data.data);
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoad(false);
        }
    };

    const createSubscription = async (data: any) => {
        try {
            const priceId = data?.price_id;
            const result = await Swal.fire({
                title: 'Confirm Subscription',
                text: 'Are you sure you want to subscribe to this plan?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#ff5c35",
                cancelButtonColor: "#6c757d",
                confirmButtonText: 'Yes, subscribe!',
                cancelButtonText: 'No, cancel'
            });

            if (result.isConfirmed) {
                await apiService.commonAPIRequest(
                    `${apiService.EndPoint.createActivePlan}`,
                    apiService.Method.post,
                    undefined,
                    { planId: priceId },
                    (response: any) => {
                        if (response.status === 201 && response?.data.data) {
                            window.open(response?.data.data, '_blank');
                        } else {
                            Swal.fire("Error", "Subscription failed. Please try again later.", "error");
                        }
                    }
                );
            }
        } catch (error) {
            console.error("Error creating subscription:", error);
            Swal.fire("Error", "Something went wrong. Please try again later.", "error");
        }
    };

    const upgradeSubscription = async (data: any) => {
        const priceId = data?.price_id;
        const result = await Swal.fire({
            title: 'Confirm Upgrade',
            text: `Are you sure you want to ${activePlanDetails?.price > data?.price ? "Downgrade" : "Upgrade"} your subscription?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#ff5c35",
            cancelButtonColor: "#6c757d",
            confirmButtonText: `Yes, ${activePlanDetails?.price > data?.price ? "downgrade!" : "upgrade!"}`,
            cancelButtonText: 'No, cancel'
        });

        if (result.isConfirmed) {
            await apiService.commonAPIRequest(
                `${apiService.EndPoint.upgradeActivePlan}`,
                apiService.Method.post,
                undefined,
                { planId: priceId },
                (response: any) => {
                    if (response.data.success && response.status === 201) {
                        chrome.runtime.sendMessage({ type: "reload" }, (response) => {
                            if (response?.success) {
                                refresh();
                            } else {
                                console.error("Failed to reload");
                            }
                        });
                    }
                }
            );
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([checkActivePlan(), getAllPlans()]);
            setLoad(false);
        };
        fetchData();

    }, [activePlan]);

    const refresh = async () => {
        try {
            setLoad(true);
            setTimeout(() => {
                checkActivePlan();
                setLoad(false);
            }, 500)
        } catch (error) {
            console.error("Error refreshing:", error);
            setLoad(false);
        }
    }

    return (
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
                                        <div className="flex justify-between">
                                            <div className="g-box-title mt-3">
                                                <h4 className="font-medium mb-3">Pricing</h4>
                                            </div>
                                            <div className="flex space-x-4 items-center">
                                                <Tooltip content="Sync & Refresh" className="custom-tooltip">
                                                    <button onClick={refresh} className="background-white border border-[#ff5c35] text-[#ff5c35] px-5 py-3 text-base rounded-lg hover:!bg-[#ff5c35] hover:!text-white transform">
                                                        <span><i className="fas fa-sync-alt"></i></span>
                                                        <span> Refresh</span>
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className="gap-5 !flex justify-center items-center mt-3">

                                            {/* Plan 1: Downgrade */}

                                            <div className={`price-box  p-6  w-72 background-three g-box ${activePlanDetails.id === allPlans[1]?.price_id ? "active" : ""}`} >
                                                <div
                                                    onClick={() => {
                                                        if (activePlanDetails.id !== allPlans[1]?.price_id) {
                                                            if (activePlan) {
                                                                upgradeSubscription(allPlans[1]);
                                                            } else {
                                                                createSubscription(allPlans[1]);
                                                            }
                                                        }
                                                    }}
                                                    className="cursor-pointer text-base p-3 background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform"
                                                >
                                                    {!activePlan ? "Subscribe" : activePlanDetails.id === allPlans[1]?.price_id ? "Subscribed" : activePlanDetails.price > allPlans[1]?.price ? "Downgrade" : "Upgrade"}
                                                </div>
                                                <div className="text-center my-4">
                                                    <span className="text-2xl font-bold">${allPlans[1]?.price}</span>
                                                    <span className="dec-color text-sm ml-1">Per {allPlans[1]?.interval}</span>
                                                </div>
                                                <hr className="my-4 border-gray-300" />
                                                <ul className="text-gray-700 space-y-2">
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i><span className="dec-color ml-2">Create Post</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i><span className="dec-color ml-2">Send Professional Replays</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i><span className="dec-color ml-2">Create Comments</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i><span className="dec-color ml-2">Save Profiles</span></li>
                                                </ul>
                                            </div>
                                            {/* Plan 2: Subscribed */}
                                            <div className={`price-box  p-6  w-72 background-three g-box ${activePlanDetails.id === allPlans[0]?.price_id ? "active" : ""}`} >
                                                <div
                                                    onClick={() => {
                                                        if (activePlanDetails.id !== allPlans[0]?.price_id) {
                                                            if (activePlan) {
                                                                upgradeSubscription(allPlans[0]);
                                                            } else {
                                                                createSubscription(allPlans[0]);
                                                            }
                                                        }
                                                    }}

                                                    className="text-base p-3 cursor-pointer background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform"
                                                >

                                                    {!activePlan ? "Subscribe" : activePlanDetails.id === allPlans[0]?.price_id ? "Subscribed" : activePlanDetails?.price > allPlans[0]?.price ? "Downgrade" : "Upgrade"}
                                                </div>
                                                <div className="text-center my-4">
                                                    <span className="text-2xl font-bold">${allPlans[0]?.price}</span>
                                                    <span className="dec-color text-sm ml-1">Per {allPlans[0]?.interval}</span>
                                                </div>
                                                <hr className="my-4 border-gray-300" />
                                                <ul className="text-gray-700 space-y-2">
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i><span className="dec-color ml-2">Create Post</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i><span className="dec-color ml-2">Send Professional Replays</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i><span className="dec-color ml-2">Create Comments</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i><span className="dec-color ml-2">Save Profiles</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    );
};

export default PricingPage;
