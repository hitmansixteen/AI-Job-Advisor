import StepPersonal from "./StepPersonal";
import StepProfessional from "./StepProfessional";
import StepPreferences from "./StepPreferences";

export default function SignupSteps({ step, formData, handleInputChange, nextStep, prevStep, handleSubmit }) {
    const steps = [
        <StepPersonal formData={formData} handleInputChange={handleInputChange} />,
        <StepProfessional formData={formData} handleInputChange={handleInputChange} />,
        <StepPreferences formData={formData} handleInputChange={handleInputChange} />,
    ];

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
            <h1>Signup</h1>
            {steps[step]}
            <div style={{ marginTop: "20px" }}>
                {step > 0 && <button onClick={prevStep}>Back</button>}
                {step < steps.length - 1 && <button onClick={nextStep}>Next</button>}
                {step === steps.length - 1 && <button onClick={handleSubmit}>Submit</button>}
            </div>
        </div>
    );
}