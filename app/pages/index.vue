<template>
  <div class="flex items-center justify-center min-h-screen w-full bg-background p-4">
    <VCard class="w-full max-w-md">
      <VCardHeader>
        <VCardTitle class="text-2xl">Login</VCardTitle>
        <VCardDescription> Enter your email below to login to your account.</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <form @submit="onSubmit" class="space-y-6">
          <VFormField v-slot="{ componentField }" name="email">
            <VFormItem>
              <VFormLabel>Email</VFormLabel>
              <VFormControl>
                <VInput type="email" placeholder="m@example.com" v-bind="componentField" />
              </VFormControl>
              <VFormMessage />
            </VFormItem>
          </VFormField>
          <VFormField v-slot="{ componentField }" name="password">
            <VFormItem>
              <VFormLabel>Password</VFormLabel>
              <VFormControl>
                <VInput type="password" v-bind="componentField" />
              </VFormControl>
              <VFormMessage />
            </VFormItem>
          </VFormField>
          <VButton type="submit" class="w-full">
            <Loader2Icon v-if="loading" class="mr-2 w-4 h-4 animate-spin" />
            Login
          </VButton>
        </form>
      </VCardContent>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2Icon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { RouteKey } from "~/const/RouteKey";
import { loginRequest } from "~/types/user/Login";

definePageMeta({
  name: RouteKey.LOGIN,
});

const { login } = useUserStore();
const { execute, loading, success, message } = useApiRef(login);

const form = useForm({
  validationSchema: toTypedSchema(loginRequest),
  initialValues: {
    email: "",
    password: "",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  await execute(values);
  if (success.value) {
    toast.success(message.value);
    await navigateTo({ name: RouteKey.ADMIN_DASHBOARD });
  } else {
    toast.error(message.value);
  }
});
</script>
