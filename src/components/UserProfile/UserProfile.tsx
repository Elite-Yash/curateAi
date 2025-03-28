import { useEffect, useState } from "react";
import { getImage } from "../../common/utils/logoUtils";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../common/config/constMessage";
import { Endpoints, fetchAPI, Method } from "../../common/config/apiService";

const UserProfile = () => {
    const navigate = useNavigate();
    const [load, setLoad] = useState<any>(true);
    const [activePlan, setActiveplan] = useState(false);

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
            if (result.status === 200 && result.message === "User does not have an active subscription.") {
                setActiveplan(true)
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => {
        checkActivePlan();
    }, []);

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
                                                        <p className="text-lg font-semibold">nilay soni</p>
                                                        <p className="text-gray-500">nilaypsoni@gmail.com</p>
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
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="px-4 py-3">Every 3 months (ACTIVE)</td>
                                                        <td className="px-4 py-3"> 11-03-2025</td>
                                                        <td className="px-4 py-3">11-06-2025</td>
                                                    </tr>
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

                                                    {activePlan ?
                                                        <>
                                                            <span className="text-base">
                                                                Join Now and Explore Everything Evarobo Offers
                                                            </span>
                                                            <button className="background-one border border-color-one text-white px-5 py-3 text-base rounded-lg  hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform" onClick={() => navigate("/pricing")}>Subscribe</button>
                                                        </>
                                                        :
                                                        <>
                                                            <button className="background-one border border-color-one text-white px-5 py-3 text-base rounded-lg  hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform">Manage Subscription</button>
                                                            <button className="background-one border border-color-one text-white px-5 py-3 text-base rounded-lg  hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform" onClick={() => navigate("/pricing")}>Upgrade / Downgrade</button>
                                                            <button className="background-one border border-color-one text-white px-5 py-3 text-base rounded-lg  hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform">Cancel Subscription</button>
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
