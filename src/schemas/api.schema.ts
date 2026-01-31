import z from "zod";

//

const ApiSchema = z.object({
    id: z.coerce.number().int(),
    url: z.url().min(1),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

const ApiCreateSchema = ApiSchema.pick({ url: true })

//

type ApiSchema = z.infer<typeof ApiSchema>
type ApiCreateSchema = z.infer<typeof ApiCreateSchema>

//

export { ApiSchema, ApiCreateSchema }
