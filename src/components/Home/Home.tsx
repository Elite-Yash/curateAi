/**
 * @component
 * @description
 * The `Home` component renders a page header section with navigation breadcrumbs and a dropdown menu. 
 * It includes a title, breadcrumb navigation links, and a campaign selection dropdown, making it ideal 
 * for a "Home" page or similar Home structure.
 *
 * @example
 * <Home />
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @returns {JSX.Element}
 * - Renders a `div` with the main structure for the Home page including:
 *   - Page title with an icon and "Home" label.
 *   - Breadcrumb navigation for Home > Home.
 *   - Dropdown menu for campaign selection.
 *
 * @styles
 * - Utilizes Tailwind CSS classes for layout and styling, with responsive adjustments for smaller screens.
 */
const Home = () => {
    return (
      <>
        <div className="c-padding-r pt-24 h-screen relative pl-[280px] pr-[30px]">
        
          <div className="grid grid-cols-4 gap-4 w-full dashboard-box">
              <div className="p-5 bg-white g-box g-box-table rounded-2xl">
                <article>
                    <div className="flex items-center justify-between">
                        <span className="icon primary-bg2 flex justify-center items-center rounded-full relative background-one w-16 h-16 ">
                            <i className="fa-solid fa-dollar-sign white-color text-xl"></i>
                        </span>
                        <span className="uppercase dec-color background-three px-2.5 rounded-3xl">+1.23%</span>
                    </div>                
                    <h4 className="font-bold pt-2">$ 599.250</h4>
                    <p className="flex items-center justify-between">
                        <span className="uppercase dec-color">Total Earnings</span>
                        <a href="#" className="underline color-one">Detail</a>
                    </p>
                </article>
              </div>
              <div className="p-5 bg-white g-box g-box-table rounded-2xl">
              <article>
                    <div className="flex items-center justify-between">
                        <span className="icon primary-bg2 flex justify-center items-center rounded-full relative dashboard-box-two w-16 h-16">
                            <i className="fa-solid fa-cart-shopping white-color text-xl"></i>
                        </span>
                        <span className="uppercase dec-color background-three px-2.5 rounded-3xl">+1.23%</span>
                    </div>                
                    <h4 className="font-bold pt-2">$ 599.250</h4>
                    <p className="flex items-center justify-between">
                        <span className="uppercase dec-color">Total Earnings</span>
                        <a href="#" className="underline color-one">Detail</a>
                    </p>
                </article>
              </div>
              <div className="p-5 bg-white g-box g-box-table rounded-2xl">
              <article>
                    <div className="flex items-center justify-between">
                        <span className="icon primary-bg2 flex justify-center items-center rounded-full relative dashboard-box-three w-16 h-16">
                            <i className="fa-solid fa-users white-color text-xl"></i>
                        </span>
                        <span className="uppercase dec-color background-three px-2.5 rounded-3xl">+1.23%</span>
                    </div>                
                    <h4 className="font-bold pt-2">$ 599.250</h4>
                    <p className="flex items-center justify-between">
                        <span className="uppercase dec-color">Total Earnings</span>
                        <a href="#" className="underline color-one">Detail</a>
                    </p>
                </article>
              </div>
              <div className="p-5 bg-white g-box g-box-table rounded-2xl">
              <article>
                    <div className="flex items-center justify-between">
                        <span className="icon primary-bg2 flex justify-center items-center rounded-full relative dashboard-box-four w-16 h-16">
                            <i className="fa-solid fa-wallet white-color text-xl"></i>
                        </span>
                        <span className="uppercase dec-color background-three px-2.5 rounded-3xl">+1.23%</span>
                    </div>                
                    <h4 className="font-bold pt-2">$ 599.250</h4>
                    <p className="flex items-center justify-between">
                        <span className="uppercase dec-color">Total Earnings</span>
                        <a href="#" className="underline color-one">Detail</a>
                    </p>
                </article> 
              </div>
            </div>
        </div>
      </>
    );
  };
  
  export default Home;
  