import React, { useEffect, useRef, useState } from "react";
import { getImage } from "../../common/utils/logoUtils";

const Evalogo: React.FC = () => {
    const robotRef = useRef<HTMLImageElement>(null);
    const [hasEntered, setHasEntered] = useState(false);

    useEffect(() => {
        const robot = robotRef.current;

        const handleAnimationEnd = () => {
            setHasEntered(true);
        };

        if (robot) {
            robot.addEventListener("animationend", handleAnimationEnd);
        }

        return () => {
            if (robot) {
                robot?.removeEventListener("animationend", handleAnimationEnd);
            }
        };
    }, []);

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <img
                    ref={robotRef}
                    src={getImage('evalogo')}
                    alt="EVA Logo"
                    style={{
                        ...styles.robot,
                        ...(hasEntered ? styles.float : styles.enter),
                    }}
                />
            </div>
        </div>
    );
};

export default Evalogo;

const styles: { [key: string]: React.CSSProperties } = {
    body: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "180px",
        margin: 0,
    },
    container: {
        perspective: "1000px",
    },
    robot: {
        width: "300px",
        opacity: 0,
        transform: "translateX(100vw)",
        animationFillMode: "forwards",
        transition: "transform 0.5s ease",
        objectFit: "contain",
        height: "200px",
    },
    enter: {
        animation: "enterFromRight 1s ease-out forwards",
    },
    float: {
        opacity: 1,
        transform: "translateY(0)",
        animation: "floatIdle 3s ease-in-out infinite alternate",
    },
};