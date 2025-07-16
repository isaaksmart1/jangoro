import { Button } from "antd";
import { useNavigation } from "react-router";

export function UpgradeBanner() {
  const handleUpgrade = () => {
    window.location.href = "https://jangoro.com";
  };

  return (
    <div className="bg-gradient-to-r from-primary to-black text-white p-4 rounded-lg mb-4">
      <h4 className="font-semibold text-sm mb-2">
        Upgrade plan
      </h4>
      <p className="text-xs text-blue-100 mb-3">
        Unlock more advanced features
      </p>
      <Button
        style={{ marginTop: 8 }}
        size="large"
        onClick={handleUpgrade}
        className="bg-white text-black hover:bg-gray-100"
      >
        Upgrade Now
      </Button>
    </div>
  );
}
