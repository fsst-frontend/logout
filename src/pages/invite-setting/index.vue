<script setup>
import { onMounted, ref } from 'vue'
import InviteCard from '@/components/invite/InviteCard.vue'
import AddInvitePopup from '@/components/invite/AddInvitePopup.vue'
import { getInviteCodeList } from '@/api/invite'
import { useI18n } from 'vue-i18n'
import jsBridge from '@/utils/jsBridge'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const inviteCodeInfo = ref([])
const addInvitePopupVisible = ref(false)

async function getData() {
  try {
    const res = await getInviteCodeList()
    inviteCodeInfo.value = res.data.invitation_code_list || []
  }
  catch {
    showToast(t('toast.apiError'))
  }
}

function showAddInvitePopup() {
  addInvitePopupVisible.value = true
}

async function handleBack() {
  try {
    await jsBridge.call('close')
  }
  catch {
    router.back()
  }
}

onMounted(() => {
  getData()
})
</script>

<template>
  <FullPageView>
    <template #header>
      <NavBar icon-color="black" @back="handleBack">
        <div class="flex w-full j-c">
          {{ t('inviteSetting.invitationSettings') }}
        </div>
      </NavBar>
    </template>
    <div class="px-16px">
      <div style="background-color: yellow;">
        {{ test }}
      </div>
      <InviteCard v-for="(item, index) in inviteCodeInfo" :key="index" :invite-code-info="item" @confirm="getData" />
      <div class="font-16px text-#2D7AFF font-600 mb-16px mt-22px bg-white flex h-48px w-full items-center justify-center" @click="showAddInvitePopup">
        + {{ t('inviteSetting.createInvitationCode') }}
      </div>
    </div>
  </FullPageView>
  <AddInvitePopup v-model:show="addInvitePopupVisible" @confirm="getData" />
</template>

<style scoped>

</style>
