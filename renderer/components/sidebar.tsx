import { Home, Users, BookMinus, Download, Info } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { ipcRenderer } from "electron";

function Sidebar() {
    const [isHovered, setIsHovered] = useState(false);

    const handleDownload = async () => {
        await ipcRenderer.invoke("download-translationFile", {link: "https://raw.githubusercontent.com/SPEED0U/StarCitizenTranslations/main/french_(france)/global.ini"});
    };

    const hoverHandler = () => {
        setIsHovered(!isHovered);
    };

    const contributeHandler = () => {
        ipcRenderer.send("contribute");
    };

    return (
        <div
        onMouseEnter={hoverHandler}
        onMouseLeave={hoverHandler}
        className="w-1/12 bg-blue-900 
                hover:w-3/12 transition-all duration-150 
                hover:items-start
                hover:px-3
                flex flex-col items-center justify-center gap-5"
        >
        <Link href="/home">
            <div className="flex gap-2 hover:cursor-pointer">
            <Home strokeWidth={1} />
            <p className="text-slate-50">{isHovered ? "Accueil" : null}</p>
            </div>
        </Link>

        <Link href="/live">
            <div className="flex gap-2 hover:cursor-pointer">
            <BookMinus strokeWidth={1} />
            <p className="text-slate-50">
                {isHovered ? "Traduction Live" : null}
            </p>
            </div>
        </Link>

        <Link href="/ptu">
            <div className="flex gap-2 hover:cursor-pointer">
            <BookMinus strokeWidth={1} />
            <p className="text-slate-50">{isHovered ? "Traduction PTU" : null}</p>
            </div>
        </Link>

        <Link href="/home">
            <div className="flex gap-2 hover:cursor-pointer" onClick={handleDownload}>
                <Download strokeWidth={1} />
                <p className="text-slate-50">
                    {isHovered ? "Récupérer le fichier de Traduction" : null}
                </p>
            </div>
        </Link>

        <div onClick={contributeHandler}>
            <div className="flex gap-2 hover:cursor-pointer">
            <Users strokeWidth={1} />
            <p className="text-slate-50">
                {isHovered ? "Contribuer à la Traduction" : null}
            </p>
            </div>
        </div>

        <Link href="/credits">
            <div className="flex gap-2 hover:cursor-pointer">
            <Info strokeWidth={1} />
            <p className="text-slate-50">{isHovered ? "Crédits" : null}</p>
            </div>
        </Link>
        </div>
    );
}

export default Sidebar;
