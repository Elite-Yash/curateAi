// import { useEffect, useState } from "react";
// import CampaignModal from "../Action/CampaignModal";
// import Breadcrumb from "../Action/Breadcrumb";
// import useCampaigns from "../customHook/useCampaigns"

/**
 * @component
 * @description
 * The `Comments` component renders a page header section with navigation breadcrumbs and a dropdown menu. 
 * It includes a title, breadcrumb navigation links, and a campaign selection dropdown, making it ideal 
 * for a "Comments" page or similar Comments structure.
 *
 * @example
 * <Comments />
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @returns {JSX.Element}
 * - Renders a `div` with the main structure for the Comments page including:
 *   - Page title with an icon and "Comments" label.
 *   - Breadcrumb navigation for Comments > Comments.
 *   - Dropdown menu for campaign selection.
 *
 * @styles
 * - Utilizes Tailwind CSS classes for layout and styling, with responsive adjustments for smaller screens.
 */
const Comments = () => {

  // const [typeValue, setTypeValue] = useState("")
  // // Fetch campaigns data on mount
  // useEffect(() => {
  //   setTypeValue("Comments")
  //   fetchCampaigns(); // Fetch campaigns on component mount
  // }, []);

  return (
    <>
      <div className="c-padding-r pt-24 h-screen relative w-[84%] left-[280px]">
        {/* <Breadcrumb name={'Comments'}></Breadcrumb> */}
        <div className="flex justify-between gap-5 w-full">
          <div className="rounded-2xl w-full">
            {/* <div className="d-global-t">
              <div className="flex justify-between border bordere7e9f6 border-t-0 border-e-0 border-s-0">
                <div className="inputgroup relative flex">
                  <span className="color00517C text-base max-[1350px]:text-sm font-semibold px-5 py-4 block max-[650px]:py-2">Campaign</span>
                </div>
              </div>
            </div> */}
            <div className="p-5 bg-white g-box g-box-table">
              <div className="d-table h-connect-table !w-full">

                {/* <div className="table-hedder flex bge7e9f6 p-4">
                  <div className="flex items-center">
                    <span className="inline-block connect-table-checkbox">
                      <input type="checkbox" className="w-5 h-5 me-3 relative left-1 top-1 outline outline-offset-2 outline-1 border-0 rounded-sm"
                      /></span>
                    <form className="ml-20 flex flex-col gap-5 max-[650px]:gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
                      <div id="searchBar" className="inputgroup relative flex w-80">
                        <input
                          type="text"
                          placeholder="Search campaigns by name..."

                          className="w-full border rounded-2xl outline-0 py-1 px-5 color00517C font-normal text-base max-[1350px]:text-sm "
                        />
                      </div>
                    </form>
                  </div> 
                  <div className="pt-2 pb-2 bge7e9f6 px-4 ms-auto mr-4">
                     <span className="icon w-4 h-4 block">
                      <img src="../images/listing-page-img/delete.svg" alt="img" className="cursor-pointer w-full h-full" />
                    </span> 
                  </div>
                </div> */}

                <div className="g-box-title">
                  <h4 className="font-medium mb-3">Comments</h4>  
                </div>
                <table className="w-full overflow-auto g-table">
                <thead>
                  <tr>
                    <th className="font-light text-base px-4 color00517C py-3 text-left">
                      <span className="inline-block connect-table-checkbox float-left relative">
                      </span>
                      <span className="info w-auto block text-left">
                        <span className="text-base uppercase font-semibold">Name</span><br />
                      </span>
                    </th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold">Url</span></th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold">Status</span></th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold">Created At</span></th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold">Last Date</span></th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold">Start - End</span></th>
                    <th className="font-light text-base px-4 color00517C py-3 text-left"><span className="text-base uppercase font-semibold">Action</span></th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3">Campaign 1</td>
                      <td className="px-4 py-3"><a href="#">www.example1.com</a></td>
                      <td className="px-4 py-3">Active</td>
                      <td className="px-4 py-3">2025-03-01</td>
                      <td className="px-4 py-3">2025-03-30</td>
                      <td className="px-4 py-3">01 Mar - 30 Mar</td>
                      <td className="px-4 py-3"><button className="text-blue-500">Edit</button></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Campaign 2</td>
                      <td className="px-4 py-3"><a href="#">www.example2.com</a></td>
                      <td className="px-4 py-3">Inactive</td>
                      <td className="px-4 py-3">2025-02-15</td>
                      <td className="px-4 py-3">2025-03-15</td>
                      <td className="px-4 py-3">15 Feb - 15 Mar</td>
                      <td className="px-4 py-3"><button className="text-blue-500">Edit</button></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Campaign 3</td>
                      <td className="px-4 py-3"><a href="#">www.example3.com</a></td>
                      <td className="px-4 py-3">Pending</td>
                      <td className="px-4 py-3">2025-03-05</td>
                      <td className="px-4 py-3">2025-04-05</td>
                      <td className="px-4 py-3">05 Mar - 05 Apr</td>
                      <td className="px-4 py-3"><button className="text-blue-500">Edit</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comments;
