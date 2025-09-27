const login = createAction(
  'Login',
  props<{ username: string; password: string }>()
);
