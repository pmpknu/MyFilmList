export interface SignUpDto {
  username: string; // Имя пользователя (3-63 символа)
  email: string;    // Email пользователя (валидный, 3-127 символов)
  password: string; // Пароль (6-127 символов)
}