
import { FileText, MessageCircle } from "lucide-react";
import {
  FiTrendingUp,
} from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";


const ContentHistory = () => {
    return (
        <div className="grid lg:grid-cols-1 gap-6">
              {/* All Box */}
                 <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-[#e3e9f1] shadow-sm mb-4 g-box ">
                   {/* Box 1 */}
                   <div
                     className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer"
                   >
                     <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#bfdbfe]">
                       <FileText className="text-[#2563eb] text-lg" />
                     </div>
                     <div>
                       <div className="text-xl font-bold text-slate-900">
                         0
                       </div>
                       <div className="text-sm text-gray-600">Posts Generated</div>
                     </div>
                   </div>
         
                   {/* Box 2 */}
                   <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer">    
                     <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#edfdf2]">
                       <MessageCircle className="text-green text-lg" />
                     </div>
                     <div>
                       <div className="text-xl font-bold text-slate-900">0</div>
                       <div className="text-sm text-gray-600">Comments Generated</div>
                     </div>
                   </div>
         
                   {/* Box 3 */}
                   <div
                     className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer"
                   >
                     <div className="w-10 h-10 flex items-center justify-center rounded-full  bg-[#fefce8]">
                       <FiTrendingUp className="text-yellow-400 text-lg" />
                     </div>
                     <div>
                       <div className="text-xl font-bold text-slate-900">
                         0
                       </div>
                       <div className="text-sm text-gray-600">Actually Used</div>
                     </div>
                   </div>
         
                   {/* Box 4 */}
                   <div className="p-4 bg-[#f0f8ff] rounded-xl hover:bg-[#d7dbdf] shadow-sm flex items-center gap-3 cursor-pointer">
                     <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#eee7f5]">
                       <CiCalendar className="text-[#9333ea] text-lg" />
                     </div>
                     <div>
                       <div className="text-xl font-bold text-slate-900">0</div>
                       <div className="text-sm text-gray-600">Per Week Avg</div>
                     </div>
                   </div>
                 </div>
        </div>
    );
};

export default ContentHistory;
