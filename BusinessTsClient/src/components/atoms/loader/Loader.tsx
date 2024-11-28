import { Grid } from '@mui/material';
import './Loader.css';
/**
 * Loader component that displays a loading animation.
 *
 * This component centers a simple dot-based loading animation vertically 
 * and horizontally in the viewport. It utilizes Material-UI's Grid component 
 * for layout and custom CSS for styling the loading dots.
 *
 * @returns {React.ReactNode} - The rendered Loader component.
 */
function Loader() {
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: '100vh' }} // Full viewport height to center vertically
        >
            <section className="dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </section>
        </Grid>
    );
}

export default Loader;
