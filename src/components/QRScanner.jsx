import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { AlertCircle } from 'lucide-react';

export default function QRScanner({ onScan, onError }) {
    const [error, setError] = useState('');
    const [hasPermission, setHasPermission] = useState(null);
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    useEffect(() => {
        // ID univoco per evitare conflitti nel DOM
        const elementId = "qr-reader-viewport";

        const startScanner = async () => {
            try {
                const formatsToSupport = [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                ];

                const html5QrCode = new Html5Qrcode(elementId);
                html5QrCodeRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    {
                        fps: 15, // Aumenta FPS per scansione più fluida
                        qrbox: { width: 300, height: 200 }, // Box rettangolare meglio per barcode
                        aspectRatio: 1.0,
                        formatsToSupport: formatsToSupport,
                        experimentalFeatures: {
                            useBarCodeDetectorIfSupported: true // Usa API native se disponibili (molto più veloce su Android/iOS)
                        }
                    },
                    (decodedText, decodedResult) => {
                        onScan(decodedText, decodedResult);
                    },
                    (errorMessage) => {
                        // Ignoriamo errori frame-by-frame
                    }
                );
                setHasPermission(true);
            } catch (err) {
                console.error("Errore avvio scanner:", err);
                setError("Impossibile accedere alla fotocamera. Verifica i permessi e assicurati di usare HTTPS o localhost.");
                setHasPermission(false);
                if (onError) onError(err);
            }
        };

        // Piccolo timeout per assicurarsi che il DOM sia pronto
        const timer = setTimeout(startScanner, 100);

        return () => {
            clearTimeout(timer);
            if (html5QrCodeRef.current) {
                if (html5QrCodeRef.current.isScanning) {
                    html5QrCodeRef.current.stop().then(() => {
                        html5QrCodeRef.current.clear();
                    }).catch(console.error);
                } else {
                    html5QrCodeRef.current.clear();
                }
            }
        };
    }, []); // Empty dependency array -> run once on mount

    return (
        <div className="w-full max-w-md mx-auto overflow-hidden rounded-xl border-2 border-dashed border-emerald-500/50 bg-black relative">
            <div id="qr-reader-viewport" className="w-full h-64 bg-black" />

            {/* Overlay guidato */}
            <div className="absolute inset-0 pointer-events-none border-[30px] border-black/50 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-emerald-400 opacity-50 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500"></div>
                </div>
            </div>

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-4 text-center">
                    <div className="text-red-400 flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {!hasPermission && !error && (
                <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-xs">
                    Accesso alla fotocamera in corso...
                </div>
            )}
        </div>
    );
}
