export interface ConfigFormState {
    categoryId: string
    createChannelId: string
    logChannelId: string
    defaultMaxMembers: string
    adminRolesIds: string[]
}

export const emptyConfigForm: ConfigFormState = {
    categoryId: '',
    createChannelId: '',
    logChannelId: '',
    defaultMaxMembers: '7',
    adminRolesIds: [],
}
