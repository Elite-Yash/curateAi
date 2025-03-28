import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { Endpoints, fetchAPI, Method } from "../../common/config/apiService";
import { API_URL } from "../../common/config/constMessage";
import Swal from 'sweetalert2';

interface createSubscriptionResponse {
    success: boolean;
    data: URL | string | any;
}

const PricingPage = () => {

    const [load, setLoad] = useState(true);
    const [allPlans, setAllPlans] = useState<any>([]);
    const [activePlan, setActiveplan] = useState(false);
    const [activePlanDetails, setActiveplanDetails] = useState<any>([]);

    const getAuthToken = (): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
                if (!response || !response.success || !response.token) {
                    reject("Failed to retrieve auth token.");
                } else {
                    resolve(response.token);
                }
            });
        });
    };

    const checkActivePlan = async () => {
        try {
            const authToken = await getAuthToken();
            const url = `${API_URL}/${Endpoints.checkActivePlan}`;
            const result = await fetchAPI(
                url,
                {
                    method: Method.get,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                });
            if (result.status === 200 && !result.success) {
                setActiveplan(false)
            } else {
                setActiveplan(true)
                setActiveplanDetails(result?.subscriptions[0])
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoad(false);
        }
    };

    const getAllPlans = async () => {
        try {
            const url = `${API_URL}/${Endpoints.getAllPlans}`;
            const result = await fetchAPI(url, { method: Method.get });
            if (result && result.data) {
                console.log("data", result.data)
                setAllPlans(result.data);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoad(false);
        }
    };

    const createSubscription = async (data: any) => {
        const priceId = data?.price_id;
        const authToken = await getAuthToken();
        const url = `${API_URL}/${Endpoints.createActivePlan}`;

        // Confirm action with the user
        const result = await Swal.fire({
            title: 'Confirm Subscription',
            text: 'Are you sure you want to subscribe to this plan?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, subscribe!',
            cancelButtonText: 'No, cancel'
        });

        if (result.isConfirmed) {
            const apiResult = await fetchAPI(
                url,
                {
                    method: Method.post,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    data: {
                        planId: priceId
                    }
                }) as createSubscriptionResponse;

            if (apiResult.success && apiResult?.data) {
                window.open(apiResult?.data, '_blank');
            }
        }
    };

    const upgradeSubscription = async (data: any) => {
        const priceId = data?.price_id;
        const authToken = await getAuthToken();
        const url = `${API_URL}/${Endpoints.upgradeActivePlan}`;

        // Confirm action with the user
        const result = await Swal.fire({
            title: 'Confirm Upgrade',
            text: `Are you sure you want to ${activePlanDetails?.price > data?.price ? "Downgrade" : "Upgrade"} your subscription?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes, ${activePlanDetails?.price > data?.price ? "downgrade!" : "upgrade!"}`,
            cancelButtonText: 'No, cancel'
        });

        if (result.isConfirmed) {
            await fetchAPI(
                url,
                {
                    method: Method.post,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    data: {
                        planId: priceId
                    }
                });

            // You can handle the response here if needed
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([checkActivePlan(), getAllPlans()]);
            setLoad(false);
        };

        const interval = setInterval(() => {
            if (activePlan) {
                clearInterval(interval); // Stop interval if activePlan is true
            } else {
                checkActivePlan();
            }
        }, 2500);

        fetchData();

        return () => clearInterval(interval);
    }, [activePlan]);

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
                                        <div className="g-box-title">
                                            <h4 className="font-medium mb-3">Pricing</h4>
                                        </div>
                                        <div className="gap-5 !flex justify-center items-center mt-3">

                                            {/* Plan 1: Downgrade */}
                                            <div className={`price-box  p-6  w-72 background-three g-box ${activePlanDetails.id === allPlans[0]?.price_id ? "active" : ""}`} >
                                                <div
                                                    onClick={() => {
                                                        if (activePlan) {
                                                            upgradeSubscription(allPlans[0]);
                                                        } else {
                                                            createSubscription(allPlans[0]);
                                                        }
                                                    }}

                                                    className="text-base p-3 background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform"
                                                >

                                                    {!activePlan ? "Subscribe" : activePlanDetails.id === allPlans[0]?.price_id ? "Subscribed" : activePlanDetails?.price > allPlans[0]?.price ? "Downgrade" : "Upgrade"}
                                                </div>
                                                <div className="text-center my-4">
                                                    <span className="text-2xl font-bold">${allPlans[0]?.price}</span>
                                                    <span className="dec-color text-sm ml-1">Per {allPlans[0]?.interval}</span>
                                                </div>
                                                <hr className="my-4 border-gray-300" />
                                                <ul className="text-gray-700 space-y-2">
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Shop Structure</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Product Statistics</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">View Newest Products</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">View Best Selling Products</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Export CSV</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Ad campaigns</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Live trends</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Site traffic</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Shop tracking</span></li>
                                                </ul>
                                            </div>

                                            {/* Plan 2: Subscribed */}
                                            <div className={`price-box  p-6  w-72 background-three g-box ${activePlanDetails.id === allPlans[1]?.price_id ? "active" : ""}`} >
                                                <div
                                                    onClick={() => {
                                                        if (activePlan) {
                                                            upgradeSubscription(allPlans[1]);
                                                        } else {
                                                            createSubscription(allPlans[1]);
                                                        }
                                                    }}
                                                    className="text-base p-3 background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform"
                                                >
                                                    {!activePlan ? "Subscribe" : activePlanDetails.id === allPlans[1]?.price_id ? "Subscribed" : activePlanDetails.price > allPlans[1]?.price ? "Downgrade" : "Upgrade"}
                                                </div>
                                                <div className="text-center my-4">
                                                    <span className="text-2xl font-bold">${allPlans[1]?.price}</span>
                                                    <span className="dec-color text-sm ml-1">Per {allPlans[1]?.interval}</span>
                                                </div>
                                                <hr className="my-4 border-gray-300" />
                                                <ul className="text-gray-700 space-y-2">
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Product Statistics</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">View Newest Products</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Shop Structure</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">View Best Selling Products</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Export CSV</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Ad campaigns</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Live trends</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Site traffic</span></li>
                                                    <li className="flex items-center"><i className="fa-solid fa-check color-one"></i><span className="dec-color ml-2">Shop tracking</span></li>
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
