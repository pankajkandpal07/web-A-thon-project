async function getCareerAdvice(){
    const skills = document.getElementById("skills").value;
    const degree = document.getElementById("degree").value;
    const cgpa = document.getElementById("cgpa").value;
    const goal = document.getElementById("goal").value;

    if (window.debug) window.debug("Input:", { skills, degree, cgpa, goal });

    const resultDiv = document.getElementById("result");

    resultDiv.style.display="block";
    resultDiv.innerHTML="⏳ Generating AI Recommendation...";

    const prompt = `
    Act as a career advisor.

    Student Profile:
    Skills: ${skills}
    Degree: ${degree}
    CGPA: ${cgpa}
    Career Goal: ${goal}

    Give:
    1. Best career paths
    2. Skills to improve
    3. Courses to take
    4. Personalized advice
    `;

    try{

        if (window.debug) window.debug("Fetching API...");
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
            method:"POST",
            headers:{
                "Authorization":"Bearer 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",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                model:"openai/gpt-3.5-turbo",
                messages:[
                    {role:"user",content:prompt}
                ]
            })
        });

        const data = await response.json();
        if (window.debug) window.debug("Response status:", response.status, "Data:", data);

        if (!response.ok) {
            throw new Error(data.error?.message || `API error ${response.status}`);
        }

        const aiText = data.choices?.[0]?.message?.content || data.error?.message;
        if (!aiText) {
            throw new Error("No AI response received");
        }

        resultDiv.innerHTML = `
            <h2>🎯 AI Career Recommendation</h2>
            <p>${aiText.replace(/\n/g, "<br>")}</p>
        `;

    }catch(error){
        if (window.debug) window.debug("Error:", error.message, error);
        resultDiv.innerHTML="❌ Error generating result.";
    }

}
