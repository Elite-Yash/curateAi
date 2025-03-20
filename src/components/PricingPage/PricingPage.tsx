import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";

const PricingPage = () => {

    const [load, setLoad] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoad(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

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
                                            <div className="price-box  p-6  w-72 background-three g-box">
                                                <div className="text-base p-3 background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform">
                                                    Downgrade
                                                </div>
                                                <div className="text-center my-4">
                                                    <span className="text-2xl font-bold">$29.00</span>
                                                    <span className="dec-color text-sm ml-1">Per month</span>
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
                                            <div className="price-box  p-6  w-72 background-three g-box active">
                                                <div className="text-base p-3 background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform">
                                                    Subscribed
                                                </div>
                                                <div className="text-center my-4">
                                                    <span className="text-2xl font-bold">$79.00</span>
                                                    <span className="dec-color text-sm ml-1">Every 3 months</span>
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

                                            {/* Plan 3: Upgrade */}
                                            <div className="price-box  p-6  w-72 background-three g-box">
                                                <div className="text-base p-3 background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#ff5c35] hover:!bg-white hover:!text-[#ff5c35] transform">
                                                    Upgrade
                                                </div>
                                                <div className="text-center my-4">
                                                    <span className="text-2xl font-bold">$149.00</span>
                                                    <span className="dec-color text-sm ml-1">Every 6 months</span>
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
