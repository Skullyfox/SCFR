import {
	Home,
	Users,
	BookMinus,
	Download,
	Info,
	ChevronLeftCircle,
	ChevronRightCircle
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ipcRenderer } from "electron";

function Sidebar() {
	const [isOpen, setIsOpen] = useState(false);
	const [version, setVersion] = useState<string | null>(null);
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [updateUrl, setUpdateUrl] = useState<string | null>(null);

	const handleDownload = async () => {
		await ipcRenderer.invoke("download-translationFile", { link: "https://raw.githubusercontent.com/SPEED0U/StarCitizenTranslations/main/french_(france)/global.ini" });
	};

	const clickHandler = () => {
		setIsOpen(!isOpen);
	};

	const contributeHandler = () => {
		ipcRenderer.send("contribute");
	};

	const handleUpdate = () => {
		ipcRenderer.send("updateApplication", { url: updateUrl });
	};

	useEffect(() => {
		ipcRenderer.invoke('get-version').then((version: string) => {
			localStorage.setItem('version', version);
			setVersion(version);
			ipcRenderer.invoke("check-for-updates", { version: version }).then(({ updateAvailable, url }: {
				updateAvailable: boolean,
				url: string
			}) => {
				setUpdateAvailable(updateAvailable);
				setUpdateUrl(url);
			});
		});
	}, []);

	const buildToggleButton = () => {
		const className = "text-gray-400 absolute top-10 hover:cursor-pointer hover:text-gray-200 ";

		return (
			isOpen ?
				<ChevronLeftCircle onClick={ clickHandler } className={ className + "right-6" } />
			:
				<ChevronRightCircle onClick={ clickHandler } className={ className + "mx-auto" } />
		);
	}

	return (
		<div
			className={
				"bg-blue-900 flex flex-col justify-center items-center relative transition-all duration-150 px-3 " +
				(isOpen ? "w-3/12" : "w-1/12")
			}
		>
			{ buildToggleButton() }

			<div className={ "flex flex-col justify-center gap-5 relative" }>
				<Link href="/home">
					<div className="flex gap-2 hover:cursor-pointer">
						<Home strokeWidth={ 1 }/>
						<p className="text-slate-50">{ isOpen ? "Accueil" : null }</p>
					</div>
				</Link>

				<Link href="/live">
					<div className="flex gap-2 hover:cursor-pointer">
						<BookMinus strokeWidth={ 1 }/>
						<p className="text-slate-50">
							{ isOpen ? "Traduction Live" : null }
						</p>
					</div>
				</Link>

				<Link href="/ptu">
					<div className="flex gap-2 hover:cursor-pointer">
						<BookMinus strokeWidth={ 1 }/>
						<p className="text-slate-50">{ isOpen ? "Traduction PTU" : null }</p>
					</div>
				</Link>

				<Link href="/eptu">
					<div className="flex gap-2 hover:cursor-pointer">
						<BookMinus strokeWidth={ 1 }/>
						<p className="text-slate-50">{ isOpen ? "Traduction EPTU" : null }</p>
					</div>
				</Link>

				<Link href="/tech-preview">
					<div className="flex gap-2 hover:cursor-pointer">
						<BookMinus strokeWidth={ 1 }/>
						<p className="text-slate-50">{ isOpen ? "Traduction TECH-PREVIEW" : null }</p>
					</div>
				</Link>

				<Link href="/home">
					<div className="flex gap-2 hover:cursor-pointer" onClick={ handleDownload }>
						<Download strokeWidth={ 1 }/>
						<p className="text-slate-50">
							{ isOpen ? "Récupérer le fichier de Traduction" : null }
						</p>
					</div>
				</Link>

				<div onClick={ contributeHandler }>
					<div className="flex gap-2 hover:cursor-pointer">
						<Users strokeWidth={ 1 }/>
						<p className="text-slate-50">
							{ isOpen ? "Contribuer à la Traduction" : null }
						</p>
					</div>
				</div>

				<Link href="/credits">
					<div className="flex gap-2 hover:cursor-pointer">
						<Info strokeWidth={ 1 }/>
						<p className="text-slate-50">{ isOpen ? "Crédits" : null }</p>
					</div>
				</Link>
				{
					updateAvailable ?
						<Link href="/home">
							<div className="flex gap-2 hover:cursor-pointer" onClick={ handleUpdate }>
								<Download strokeWidth={ 1 }/>
								<p className="text-slate-50">
									{ isOpen ? "Mettre à jour l'application" : null }
								</p>
							</div>
						</Link>
						: null
				}
			</div>

			<p className="text-gray-500 absolute bottom-3 mx-auto">v{ version }</p>
		</div>
	);
}

export default Sidebar;
