export default function CreditCounter({ domain, credits }) {
    const domainName = domain?.name;
    const courseCredits = credits || 0;

    if (!domainName) return <p className="block text-sm font-medium">No credits attached</p>;
    return (
        <p className="block text-sm font-medium">
            {domainName} credits attached: {courseCredits}
        </p>
    );
}
