import z from "zod";

//

const ApiSchema = z.object({
    id: z.coerce.number().int(),
    url: z.url().min(1).max(512),
    hash: z.string().min(1).max(512),
    email: z.email(),
    online: z.boolean().default(false),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const ApiCreateSchema = ApiSchema.pick({ url: true, hash: true, email: true })

//

type ApiSchema = z.infer<typeof ApiSchema>
type ApiCreateSchema = z.infer<typeof ApiCreateSchema>

//

export { ApiSchema, ApiCreateSchema }
