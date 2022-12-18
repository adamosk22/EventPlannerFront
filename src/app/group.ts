export class Group{
    name?: string
    description?: string
    code?: string
    userEmail?: string | null

    public constructor(init?: Partial<Group>) {
        Object.assign(this, init);
    }
}