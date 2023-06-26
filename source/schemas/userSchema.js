import { object, string, date } from "yup";

const userSchema = object({
  email: string("Email must be type string")
    .required("Email is required")
    .email("Invalid email"),
  password: string("Password must be type string").required(
    "Password is required"
  ),
  name: string("Name must be type string").required("Name is required"),
  cpf: string("CPF must be type string")
    .required("CPF is required")
    .length(11, "CPF must have 11 numbers"),
  birth_date: date("Invalid date").required("Date of birth is required"),
  address: string("Address must be a string").required("Address is required"),
  number: string("Number must be a string").required("Number is required"),
  neighborhood: string("Neighborhood must be a string").required(
    "Neighborhood is required"
  ),
  city: string("City must be a string").required("City is required"),
  uf: string("UF must be a string")
    .required("UF is required")
    .length(2, "UF must have length 2"),
  tel: string("Phone must be type string").required("Tel is required"),
});

export default userSchema;
