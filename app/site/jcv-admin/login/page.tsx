import { LoginForm } from "./login-form";
import { CenteredContainer } from "@components/container/centered-container";

export default async function LoginPage() {
  return (
    <CenteredContainer maxWidth={"1600px"}>
      <LoginForm />
    </CenteredContainer>
  );
}
