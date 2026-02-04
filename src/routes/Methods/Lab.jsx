// src/routes/Methods/Metodos.jsx
import { useParams, Navigate, Link } from "react-router-dom";

export default function Lab() {
    const { metodo } = useParams();
    const LessonComponent = lessonsMap[metodo];

    if (!LessonComponent) {
        return <Navigate to="/404" replace />;
    }
    
    return (
        <div className="cf-lesson-page">
            {/* FONDO HYPERSPEED + VELO OSCURO */}
            <div className="cf-lesson-bg">
                <div className="cf-lesson-bg-overlay" />
            </div>
            {/* CONTENIDO DE LA LECCIÓN */}
            <div className="cf-lesson-content">
                <LessonComponent />

                <Link to={`/lab/${metodo}`} className="cf-lesson-link-lab">
                    <i className="fa-solid fa-bolt" aria-hidden="true"></i>
                    <span>Es momento de practicar con código</span>
                </Link>
            </div>
        </div>
    );
}