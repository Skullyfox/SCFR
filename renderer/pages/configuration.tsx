import React , {useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { shell } from 'electron';

import { ipcRenderer } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faPython } from '@fortawesome/free-brands-svg-icons';
import { faGitAlt } from '@fortawesome/free-brands-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Configuration() {
    const [pythonStatus, setPythonStatus] = useState('Checking...');
    const [pipStatus, setPipStatus] = useState('Checking...');
    const [gitStatus, setGitStatus] = useState('Checking...');
    const [pendingInstallGit, setPendingInstallGit] = useState(false);
    const [pendingInstallPython, setPendingInstallPython] = useState(false);
    const [platform, setPlatform] = useState(null);

    const openInstallation = (event) => {
        const url = event.target.dataset.link;
        shell.openExternal(url);
    };

    const installGit = () => {
        setPendingInstallGit(true);
        ipcRenderer.invoke('install-git', {platform: platform}).then(
            (result) => {setPendingInstallGit(false); setGitStatus('Git is installed'); console.log(result)},
            (error) => {setPendingInstallGit(false); console.log(error)}
        )
    };

    const installPython = () => {
        setPendingInstallPython(true);
        ipcRenderer.invoke('install-python', {platform: platform}).then(
            (result) => {setPendingInstallPython(false); setPythonStatus('Python is installed'); console.log(result)},
            (error) => {setPendingInstallPython(false); console.log(error)}
        )
    };

    useEffect(() => {
        const platform = localStorage.getItem('platform');
        
        setPlatform(platform);

        ipcRenderer.invoke('check-python', {platform: platform}).then(
            (version) => setPythonStatus(`version : ${version.split(' ')[1]}`),
            (error) => setPythonStatus(`not installed`),
        );
        
        ipcRenderer.invoke('check-pip', {platform: platform}).then(
            (version) => setPipStatus(`version : ${version.split(' ')[1]}`),
            (error) => setPipStatus(`not installed`)
        );
        
        ipcRenderer.invoke('check-git').then(
            (version) => setGitStatus(`version : ${version.split(' ')[2]}`),
            (error) => setGitStatus(`not installed`)
        );
    }, []);

    return (
        <React.Fragment>
        <Head>
            <title>Osint Companion | Configuration</title>
        </Head>
        <div className='container p-5 grid grid-col-1 w-full  pt-10'>
            <div className='flex items-center justify-start h-10'>
                <FontAwesomeIcon className={`mr-2 animate-pulse ${pythonStatus === 'not installed' 
                || pythonStatus === 'Checking...'? 'text-rose-400 ' : 'text-indigo-600'}`} icon={faCircle} />
                <p>Python : <span className={pythonStatus === 'not installed' 
                || pythonStatus === 'Checking...' ? "text-rose-400" : "text-indigo-600"}>{pythonStatus}</span></p>
            </div>
            <div className='flex items-center justify-start h-10'>
                <FontAwesomeIcon className={`mr-2 animate-pulse ${pipStatus === 'not installed' 
                || pipStatus === 'Checking...' ? 'text-rose-400 ' : 'text-indigo-600'}`} icon={faCircle} />
                <p>Pip : <span className={pipStatus === 'not installed' 
                || pipStatus === 'Checking...' ? "text-rose-400" : "text-indigo-600"}>{pipStatus}</span></p>
            </div>
            <div className="buttonsContainer">
                {pendingInstallPython ?
                    <button 
                        type='button' disabled className='bg-slate-300 rounded-md p-2 max-w-max my-3 text-slate-900'
                        onClick={installPython}>
                            <FontAwesomeIcon className="animate-spin" icon={faSpinner} /> Install Pending ...
                    </button> :
                    <button 
                        type='button' disabled={pythonStatus != 'not installed' || platform != 'linux'} className={pythonStatus != 'not installed' ? 
                        "bg-slate-500 rounded-md p-2 max-w-max mb-3 text-slate-900" : 
                        "bg-slate-300 rounded-md p-2 max-w-max mb-3 text-slate-900"}
                        onClick={installPython}>
                            <FontAwesomeIcon icon={faPython} /> Automatic Installation (Linux Only)
                    </button> 
                }
                <button 
                    disabled={pythonStatus != 'not installed'}
                    data-link="https://www.python.org/downloads/"
                    type='button' className={pythonStatus != 'not installed' ? 
                    "bg-slate-500 rounded-md p-2 max-w-max mx-3 text-slate-900" : 
                    "bg-slate-300 rounded-md p-2 max-w-max mx-3 text-slate-900"}
                    onClick={openInstallation}>
                        <FontAwesomeIcon icon={faPython} /> Manual Installation
                </button>
            </div>
            <div className='flex items-center justify-start h-10'>
                <FontAwesomeIcon className={`mr-2 animate-pulse ${gitStatus === 'not installed' 
                || gitStatus === 'Checking...' ? 'text-rose-400 ' : 'text-indigo-600'}`} icon={faCircle} />
                <p>git : <span className={gitStatus === 'not installed' 
                || gitStatus === 'Checking...' ? "text-rose-400" : "text-indigo-600"}>{gitStatus}</span></p>
            </div>
            <div className="buttonsContainer">
                {pendingInstallGit ?
                    <button 
                        type='button' disabled className='bg-slate-300 rounded-md p-2 max-w-max my-3 text-slate-900'
                        onClick={installGit}>
                            <FontAwesomeIcon className="animate-spin" icon={faSpinner} /> Install Pending ...
                    </button> :
                    <button 
                        type='button' disabled={gitStatus != 'not installed' || platform != 'linux' } className={gitStatus != 'not installed' ? 
                        "bg-slate-500 rounded-md p-2 max-w-max mb-3 text-slate-900" : 
                        "bg-slate-300 rounded-md p-2 max-w-max mb-3 text-slate-900"}
                        onClick={installGit}>
                            <FontAwesomeIcon icon={faGitAlt} /> Automatic Installation (Linux Only)
                    </button> 
                }
                <button 
                    disabled={gitStatus != 'not installed'}
                    data-link="https://git-scm.com"
                    type='button' className={pythonStatus != 'not installed' ? 
                    "bg-slate-500 rounded-md p-2 max-w-max mx-3 text-slate-900" : 
                    "bg-slate-300 rounded-md p-2 max-w-max mx-3 text-slate-900"}
                    onClick={openInstallation}>
                        <FontAwesomeIcon icon={faGitAlt} /> Manual Installation
                </button>
            </div>
            <Link href="/home">back</Link>
        </div>
        </React.Fragment>
    )
}

export default Configuration
