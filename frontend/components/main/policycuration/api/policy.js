// ./api/policy.js
export const requestFilterPolicies = async (payload) => {
    const response = await fetch("http://192.168.0.3:8085/api/policies/filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
    return data;
  };
  