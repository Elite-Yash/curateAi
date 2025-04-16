import { getImage } from "../../common/utils/logoUtils";

const Loader = () => {
    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <span className="loader relative w-24 h-24 object-cover p-2">
                    <img src={getImage('fLogo')} alt="img" className="w-full h-full" />
                </span>
                <span className="text-[#ff5c35] text-xl font-light">Loading...</span>
            </div>
        </>
    );
};

export default Loader;
