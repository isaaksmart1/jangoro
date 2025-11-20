import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

import { Button, Card, Drawer, Form } from "antd";

import { ErrorAlert } from "@/components/alert";
import { API_URL } from "@/providers";
import { getNameInitials } from "@/utilities";

import { CustomAvatar } from "../../custom-avatar";
import { Text } from "../../text";


type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
};

export const AccountSettings = ({ opened, setOpened }: Props) => {
  const [user, setUser] = useState();
  const [error, setError] = useState({ title: "", message: "" });
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const { push } = useNavigation();

  const closeModal = () => {
    setOpened(false);
    setAlert(false);
  };

  const handleDeactivate = async () => {
    const user = localStorage.getItem("user");
    try {
      if (user) {
        const result = await fetch(`${API_URL}/user/deactivate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: user,
        });
        if (result.status === 200) {
          setAlert(true);
          setAlertType("success");
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.removeItem("plan");
          setTimeout(() => {
            push("/register");
          }, 2000);
        } else {
          const error = await result.text();
          const errors = {
            title: "Delete Account Failed",
            message: error,
          };
          setError(errors);
          setAlert(true);
          setAlertType("error");
        }
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const user = localStorage.getItem("user");
      setUser(JSON.parse(user));
    };
    getUser();
  }, []);

  // if (queryResult?.isLoading) {
  //   return (
  //     <Drawer
  //       open={opened}
  //       width={756}
  //       styles={{
  //         body: {
  //           background: "#f5f5f5",
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //         },
  //       }}
  //     >
  //       <Spin />
  //     </Drawer>
  //   );
  // }

  return (
    <Drawer
      onClose={closeModal}
      open={opened}
      width={756}
      styles={{
        body: { background: "#FFFFFF", padding: 0 },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#000000" }}>
          Account Settings
        </Text>
        <Button
          type="text"
          icon={
            <CloseOutlined style={{ fontWeight: "bold", color: "#000000" }} />
          }
          onClick={() => closeModal()}
        />
      </div>
      <div
        style={{
          padding: "16px",
        }}
      >
        <Card
          style={{
            backgroundColor: "#FFFFFF",
            border: "none",
          }}
        >
          <Form layout="vertical">
            <CustomAvatar
              shape="square"
              src={user?.avatarUrl}
              name={getNameInitials(user?.email || "")}
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />
            <Form.Item label="Email" name="Email">
              <Text style={{ color: "#000000" }}>{user?.email}</Text>
            </Form.Item>
            <Button
              style={{
                borderRadius: 12,
                color: "red",
                borderColor: "red",
                fontWeight: "bold",
                boxShadow: "none",
              }}
              onClick={handleDeactivate}
            >
              Delete Account
            </Button>
            <Form.Item>
              <Text style={{ color: "#000000", fontSize: 16 }}>
                This action will permanently delete your account and immediately
                cancel your subscription.
              </Text>
            </Form.Item>
          </Form>
          {/* <SaveButton
            {...saveButtonProps}
            style={{
              display: "block",
              marginLeft: "auto",
            }}
          /> */}
          {alert && (
            <ErrorAlert
              type={alertType}
              message={error.title}
              description={error.message}
            />
          )}
        </Card>
      </div>
    </Drawer>
  );
};
