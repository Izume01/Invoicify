"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const onboardingquestion = [
    {
        question: "What is your Role?",
        options: [
            "I'm a freelancer / individual",
            "I run a business / agency",
            "Just exploring for now",
        ],
    },
    {
        question: "What is your primary goal with invoicing?",
        options: [
            "Get paid faster",
            "Keep track of finances",
            "Professional appearance",
            "Other",
        ],
    },
    {
        question: "How often do you send invoices?",
        options: ["Daily", "Weekly", "Monthly", "Rarely"],
    },
    {
        question: "What features are most important to you?",
        options: [
            "Recurring invoices",
            "Expense tracking",
            "Client portal",
            "Custom templates",
        ],
    },
];

// For future we have to implement a backend  + a loader for the finishing logic 

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    const nextStep = () => {
        if (currentStep < onboardingquestion.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit logic or redirect
            console.log("All answers submitted:", answers);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-black text-white">
            <div className="w-full max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="flex w-full items-center justify-between border-4 sm:border-8 border-orange-100 p-2 sm:p-4 mb-8 sm:mb-20">
                    {onboardingquestion.map((_, index) => (
                        <div
                            key={index}
                            className={`flex-1 h-6 sm:h-10 transition-all ${
                                index <= currentStep ? "bg-orange-100" : "bg-gray-800"
                            }`}
                            style={{
                                transition:
                                    "background-color 0.2s ease-in-out, opacity 0.2s ease-in-out",
                            }}
                        ></div>
                    ))}
                </div>

                <div className="my-6 sm:my-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">Welcome, [First Name]! 👋</h1>
                    <p className="text-lg sm:text-xl lg:text-2xl mt-4 text-gray-300">
                        Let's get your invoicing workspace set up. It only takes a few seconds
                    </p>
                </div>

                {/* Question */}
                <Card className="bg-gray-900 border border-gray-800 rounded-xl mb-6 sm:mb-10 text-white">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {onboardingquestion[currentStep].question}
                        </CardTitle>
                        <CardDescription className="text-gray-400 pt-2 text-sm sm:text-base">
                            Please select one of the options below.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                        {onboardingquestion[currentStep].options.map((option, index) => (
                            <button
                                key={index}
                                className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all duration-200 border-2 text-sm sm:text-base ${
                                    answers[currentStep] === option
                                        ? "bg-orange-600 border-orange-500 text-white font-semibold"
                                        : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:scale-105 hover:border-gray-600"
                                }`}
                                onClick={() => {
                                    const newAnswers = [...answers];
                                    newAnswers[currentStep] = option;
                                    setAnswers(newAnswers);
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </CardContent>
                </Card>
                

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        className="px-4 sm:px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 disabled:opacity-30 transition-colors text-sm sm:text-base"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 sm:px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 disabled:opacity-30 transition-colors text-sm sm:text-base"
                        onClick={nextStep}
                    >
                        {currentStep === onboardingquestion.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
