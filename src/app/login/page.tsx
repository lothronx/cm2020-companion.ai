export default function Login() {
  return (
    <main>
      <form action="" method="post">
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Log in</button>
      </form>
    </main>
  );
}
