import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { apiService } from "../../common/config/apiService";
import Swal from "sweetalert2";
import { Tooltip } from "flowbite-react";
import { getImage } from "../../common/utils/logoUtils";

const PricingPopup = ({ isOpen, onClose }: any) => {
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
        title: "Confirm Subscription",
        text: "Are you sure you want to subscribe to this plan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, subscribe!",
        cancelButtonText: "No, cancel",
      });

      if (result.isConfirmed) {
        await apiService.commonAPIRequest(
          `${apiService.EndPoint.createActivePlan}`,
          apiService.Method.post,
          undefined,
          { planId: priceId },
          (response: any) => {
            if (
              response.status === 201 &&
              response?.data.data &&
              response?.data.success
            ) {
              window.open(response?.data.data, "_blank");
            } else {
              Swal.fire({
                title: "Error",
                text: "Subscription failed. Please try again later.",
                icon: "error",
                confirmButtonColor: "#2563eb",
              });
            }
          }
        );
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const upgradeSubscription = async (data: any) => {
    const priceId = data?.price_id;
    const result = await Swal.fire({
      title: "Confirm Upgrade",
      text: `Are you sure you want to ${activePlanDetails?.price > data?.price ? "Downgrade" : "Upgrade"
        } your subscription?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Yes, ${activePlanDetails?.price > data?.price ? "downgrade!" : "upgrade!"
        }`,
      cancelButtonText: "No, cancel",
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
    if (isOpen) {
      const fetchData = async () => {
        await Promise.all([checkActivePlan(), getAllPlans()]);
        setLoad(false);
      };
      fetchData();
    }
  }, [activePlan, isOpen]);

  const refresh = async () => {
    try {
      setLoad(true);
      setTimeout(() => {
        checkActivePlan();
        setLoad(false);
      }, 500);
    } catch (error) {
      console.error("Error refreshing:", error);
      setLoad(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-base">
      <div className="bg-white p-5 rounded-lg shadow-xl w-[90%] max-w-[600px] relative">
        {/* Close button */}
        {/* <button
          onClick={onClose}
          className="w-8 h-8 flex float-end rounded-full hover:bg-[#f3f4f6] transition absolute right-[40px] justify-center items-center top-[10px]"
        >
          <img
            src={getImage("close")}
            alt="close"
            className="w-4 h-4"
          />
        </button> */}

        {load ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="rounded-2xl w-full">
                <div className="">
                  <div className="d-table h-connect-table !w-full">


                    {/* Modal Header */}
                    <div className="relative flex justify-between item-center">
                      <div className="flex gap-3">
                        <span className="relative p-logo border-[2.5px] border-solid h-12 w-12 rounded-full border-[#2563eb]">
                          <img src={getImage("fLogo")} alt="img" className="" />
                        </span>
                        <h4 className="popup-title font-semibold text-xl leading-10 mt-1">
                          Upgrade your plan
                        </h4>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex space-x-4 items-center">
                          <Tooltip
                            content="Sync & Refresh"
                            className="custom-tooltip"
                          >
                            <button
                              onClick={refresh}
                              className="background-white border border-[#2563eb] text-[#2563eb] px-3 py-1 text-base rounded-lg hover:!bg-[#2563eb] hover:!text-white transform"
                            >
                              <span>
                                <i className="fas fa-sync-alt"></i>
                              </span>
                              <span> Refresh</span>
                            </button>
                          </Tooltip>
                        </div>
                        <span
                          onClick={onClose}
                          className="close-box w-8 h-8 bg-no-repeat bg-center cursor-pointer mt-2"
                        >
                          <img
                            src={getImage("close")}
                            alt="img"
                            className="w-6 h-6 rounded-full"
                          />
                        </span>

                      </div>



                    </div>

                    {/* <div className="flex justify-between">
                      <div className="g-box-title mt-3">
                        <h4 className="font-medium mb-3">Upgrade your plan</h4>
                      </div>
                      <div className="flex space-x-4 items-center">
                        <Tooltip
                          content="Sync & Refresh"
                          className="custom-tooltip"
                        >
                          <button
                            onClick={refresh}
                            className="background-white border border-[#2563eb] text-[#2563eb] px-3 py-1 text-base rounded-lg hover:!bg-[#2563eb] hover:!text-white transform"
                          >
                            <span>
                              <i className="fas fa-sync-alt"></i>
                            </span>
                            <span> Refresh</span>
                          </button>
                        </Tooltip>
                      </div>
                    </div> */}
                    <div className="gap-5 !flex justify-center items-center mt-1 p-5 header-top">




                      {/* Plan 1 */}
                      <div
                        className={`price-box p-6  w-72 background-three g-box relative ${activePlanDetails.id === allPlans[1]?.price_id
                          ? "active"
                          : ""
                          }`}
                      >
                        <div className="text-center my-4">
                          <span className="text-2xl font-bold">
                            ${allPlans[1]?.price}
                          </span>
                          <span className="dec-color text-sm ml-1">
                            Per {allPlans[1]?.interval}
                          </span>
                        </div>
                        <hr className="my-4 border-gray-300" />
                        <ul className="text-gray-700 space-y-2 my-4">
                          <li className="flex items-center">
                            <i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i>
                            <span className="dec-color ml-2">Create Post</span>
                          </li>
                          <li className="flex items-center">
                            <i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i>
                            <span className="dec-color ml-2">
                              Send Professional Replies
                            </span>
                          </li>
                          <li className="flex items-center">
                            <i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i>
                            <span className="dec-color ml-2">
                              Create Comments
                            </span>
                          </li>
                          <li className="flex items-center">
                            <i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i>
                            <span className="dec-color ml-2">Save Profiles</span>
                          </li>
                        </ul>


                        <div
                          onClick={() => {
                            if (
                              activePlanDetails.id !== allPlans[1]?.price_id
                            ) {
                              if (activePlan) {
                                upgradeSubscription(allPlans[1]);
                              } else {
                                createSubscription(allPlans[1]);
                              }
                            }
                          }}
                          className="cursor-pointer text-base p-3 background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#2563eb] hover:!bg-white hover:!text-[#2563eb] transform"
                        >
                          {!activePlan
                            ? "Subscribe"
                            : activePlanDetails.id === allPlans[1]?.price_id
                              ? "Subscribed"
                              : activePlanDetails.price > allPlans[1]?.price
                                ? "Downgrade"
                                : "Upgrade"}
                        </div>

                      </div>

                      {/* Plan 2 */}
                      <div
                        className={`price-box  p-6  w-72 background-three g-box ${activePlanDetails.id === allPlans[0]?.price_id
                          ? "active"
                          : ""
                          }`}
                      >
                     
                        <div className="text-center my-4">
                          <span className="text-2xl font-bold">
                            ${allPlans[0]?.price}
                          </span>
                          <span className="dec-color text-sm ml-1">
                            Per {allPlans[0]?.interval}
                          </span>
                        </div>
                        <hr className="my-4 border-gray-300" />
                        <ul className="text-gray-700 space-y-2 my-4">
                          <li className="flex items-center">
                            <i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i>
                            <span className="dec-color ml-2">Create Post</span>
                          </li>
                          <li className="flex items-center">
                            <i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i>
                            <span className="dec-color ml-2">
                              Send Professional Replies
                            </span>
                          </li>
                          <li className="flex items-center">
                            <i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i>
                            <span className="dec-color ml-2">
                              Create Comments
                            </span>
                          </li>
                          <li className="flex items-center">
                            <i className="fa-solid fa-check color-one w-4.5 h-4.5 flex justify-center items-center bg-white border border-color-one p-0 rounded-full text-[10px]"></i>
                            <span className="dec-color ml-2">Save Profiles</span>
                          </li>
                        </ul>

                           <div
                          onClick={() => {
                            if (
                              activePlanDetails.id !== allPlans[0]?.price_id
                            ) {
                              if (activePlan) {
                                upgradeSubscription(allPlans[0]);
                              } else {
                                createSubscription(allPlans[0]);
                              }
                            }
                          }}
                          className="text-base p-3 cursor-pointer background-one text-white text-center font-normal py-2 rounded-lg border border-transparent hover:!border-[#2563eb] hover:!bg-white hover:!text-[#2563eb] transform"
                        >
                          {!activePlan
                            ? "Subscribe"
                            : activePlanDetails.id === allPlans[0]?.price_id
                              ? "Subscribed"
                              : activePlanDetails?.price > allPlans[0]?.price
                                ? "Downgrade"
                                : "Upgrade"}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingPopup;
