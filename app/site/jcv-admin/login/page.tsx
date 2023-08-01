import { LoginForm } from "./login-form";
import { CenteredContainer } from "@components/container/centered-container";

export default async function LoginPage() {
  return (
    <CenteredContainer maxWidth={"800px"}>
      <LoginForm />
    </CenteredContainer>
  );
}
