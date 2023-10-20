import { XCircle, Move } from 'lucide-react';
import { ipcRenderer } from 'electron';

function Content ({ children }) {
    const CloseApp = () => {
        ipcRenderer.invoke('close-app');
    }

    return (
        <div className="w-11/12 bg-gray-950 max-h-screen overflow-y-scroll relative">
            <div className="fixed right-5 top-5 flex gap-5 bg-gray-950 pl-5">
                <Move strokeWidth={1} id="draggableZone" className='text-blue-500'/>
                <XCircle strokeWidth={1} onClick={CloseApp}
                    className='text-blue-900 hover:cursor-pointer hover:text-blue-500'/>
            </div>
            {children}
        </div>
    )
}

export default Content;