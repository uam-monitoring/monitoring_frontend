import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  width: 60%;
  height: 80%;
  border: 2px solid var(--color-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const LoginTitle = styled.h1`
  position: absolute;
  top: 5%;
  left: 5%;
  font-size: 2rem;
  font-weight: var(--weight-point);
`;

const LoginInputBox = styled.form`
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
`;

const LoginInput = styled(TextField)({
  "& label.Mui-focused": {
    color: "var(--color-gray)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "var(--color-gray)",
  },
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  return (
    <Wrapper>
      <LoginContainer>
        <LoginTitle>UAM MONITOR</LoginTitle>
        <LoginInputBox>
          <LoginInput
            label="ID"
            fullWidth
            required
            type="text"
            value={id}
            variant="standard"
            sx={{ marginBottom: "30px" }}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
          <LoginInput
            required
            fullWidth
            label="Password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
            }}
            variant="standard"
            sx={{ marginBottom: "50px" }}
          />
          <Button
            variant="contained"
            sx={{
              boxShadow: "none",
              backgroundColor: "var(--color-gray)",
              borderColor: "var(--color-gray)",
              "&:hover": {
                backgroundColor: "white",
                borderColor: "var(--color-gray)",
                boxShadow: "none",
              },
              "&:active": {
                boxShadow: "none",
                backgroundColor: "var(--color-gray)",
                borderColor: "var(--color-gray)",
              },
            }}
            onClick={() => {
              navigate("monitor");
            }}
          >
            Login
          </Button>
        </LoginInputBox>
      </LoginContainer>
    </Wrapper>
  );
}
