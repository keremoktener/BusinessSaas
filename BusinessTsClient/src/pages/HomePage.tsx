import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../store/index";
import { useDispatch } from "react-redux";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import localImage1 from '../images/resim.jpg';
import localImage2 from '../images/unnamed.jpg';
import localImage3 from '../images/unnamed2.png';

function HomePage() {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    const images = [
        'https://blog.inkaik.com/wp-content/uploads/2024/02/Insan-Kaynaklari-Alaninda-Gelecegin-Meslekleri-ve-Trendleri-scaled.jpg',
        localImage1,
        localImage2,
        localImage3
    ];

    const texts = [
        "IK Yönetim",
        "Finans Ve Muhasebe Yönetimi",
        "Proje Yönetimi",
        "Kullanıcı Yönetimi",
        "Abonelik ve Plan Yönetimi",
        "Kuruluş Yönetimi",
        "Takvim Ve Planlama",
        "Kullanıcı Destek Ve Yönetimi"
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ margin: 0, padding: 0, height: '100vh', overflow: 'hidden' }}>
            <Slider {...settings} style={{ height: 'calc(100vh - 100px)' }}> {/* Slider yüksekliğini ayarladık */}
                {images.map((img, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%', 
                            position: 'relative', 
                        }}
                    >
                        <img 
                            src={img} 
                            alt={`slide ${index}`} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                            }} 
                        />
                        <div 
                            style={{ 
                                position: 'absolute', 
                                bottom: '10px', 
                                left: '50%', 
                                transform: 'translateX(-50%)', 
                                color: 'white', 
                                backgroundColor: 'black', 
                                padding: '5px', 
                                borderRadius: '5px',
                                opacity: 0.8,
                                textAlign: 'center' 
                            }}
                        >
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '200' }}>
                                {texts[currentTextIndex]} 
                            </h4>
                        </div>
                    </div>
                ))}
            </Slider>

            <div style={{ 
                padding: '10px', 
                backgroundColor: '#f0f0f0', 
                textAlign: 'center', 
                position: 'relative', 
                height: '50px', 
                overflow: 'hidden' 
            }}>
                <div style={{ 
                    display: 'flex', 
                    position: 'absolute', 
                    whiteSpace: 'nowrap', 
                    animation: 'slide 10s linear infinite' 
                }}>
                    {texts.map((text, index) => (
                        <div key={index} style={{ margin: '0 15px', opacity: index === currentTextIndex ? 1 : 0.5 }}>
                            <h4 style={{ margin: 0, color: '#000', fontSize: '14px', fontWeight: '300' }}>
                                {text}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes slide {
                    0% {
                        transform: translateX(100%);
                    }
                    20% {
                        transform: translateX(0%);
                    }
                    80% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
        </div>
    );
}

export default HomePage;
