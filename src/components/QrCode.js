import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRModal = ({ isOpen, onClose, firstName, lastName, id, onDownload }) => {
  if (!isOpen) return null;

  return (
  
      <div id="QRMODALHOLDERS" className="bg-white p-8 rounded-xl shadow-2xl relative w-96 max-w-[90vw] mx-auto">
        {/* Decorative Top Bar */}
      
        <button  
        id='CloseQRCodeBtn'
  onClick={onClose}
  className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors"
  aria-label="Close modal"
>
  X
</button>



        <div className="text-center space-y-6 pt-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {firstName} {lastName}'s QR Code
          </h3>

          <div className="bg-gray-50 p-6 rounded-lg inline-block">
            <QRCodeCanvas
              value={id || "No ID available"}
              size={200}
              level="H"
              includeMargin={true}
              className="shadow-sm"
            />
          </div>

      
          <button
            onClick={onDownload}
            id="DLBTN"
            className="w-full max-w-xs mx-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
           
            Download QR Code
          </button>
        </div>
      </div>
   
  );
};

export default QRModal;