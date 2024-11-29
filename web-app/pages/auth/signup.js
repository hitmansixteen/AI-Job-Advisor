import { useState } from "react";
import SignupSteps from "@/components/SignupSteps";
import { useRouter } from "next/router";

export default function Signup() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        skills: [],
        experience: "",
        education: "",
        preferredJobLocation: "",
        interests: [],
    });

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert("Signup successful!");
                router.push("/");
            } else {
                alert("Signup failed. Try again.");
            }
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <SignupSteps
            step={currentStep}
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
        />
    );
}
