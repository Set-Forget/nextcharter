export const colorPallete = {
    blank: {
        bg: "bg-white",
    },
    "plan to meet": {
        bg: "bg-blue-500",
        text: "text-white",
        tp: "text-blue-500",
    },
    "not met": {
        bg: "bg-slate-500",
        text: "text-white",
        tp: "text-slate-500",
    },
    "attempting to meet": {
        bg: "bg-amber-400",
        text: "text-grey-500",
        tp: "text-amber-400",
    },
    attempting: {
        bg: "bg-amber-400",
        text: "text-grey-500",
        tp: "text-amber-400",
    },
    competent: {
        bg: "bg-green-500",
        text: "text-white",
        tp: "text-green-500",
    },
    transfer: {
        bg: "bg-green-500",
        text: "text-white",
        tp: "text-green-500",
    },
    "competent with distinction": {
        bg: "bg-green-500",
        text: "text-white",
        tp: "text-green-500",
    },
    "' '": {
        bg: "bg-white",
    },
};

export default function CompetencyCard({ title, status, courseName }) {
    return (
        <div className="relative inline-block tooltip">
            <div
                className={`w-[4.6rem] truncate h-16 ${colorPallete[status].bg} ${colorPallete[status].text} flex justify-center items-center rounded-md`}
            >
                <span className="truncate p-2">{title}</span>
            </div>
            {status !== "blank" && (
                <div
                    className={`flex ${colorPallete[status].bg} ${colorPallete[status].text} flex-col p-2 w-56 rounded-lg z-20 absolute right-0 invisible tooltip-item mt-2`}
                >
                    <p className="text-sm capitalize">
                        <span className="font-semibold">Status</span>: {status}
                    </p>
                    <p className="text-sm capitalize">
                        <span className="font-semibold">Belongs to</span>: {courseName}
                    </p>
                    <svg
                        className={`absolute ${colorPallete[status].tp} -top-3 h-8 right-0 mr-3`}
                        x="0px"
                        y="0px"
                        viewBox="0 0 255 255"
                        xmlSpace="preserve"
                    >
                        <polygon className="fill-current" points="50,0 100,100 0,100" />
                    </svg>
                </div>
            )}
        </div>
    );
}
