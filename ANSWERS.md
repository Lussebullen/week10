#Q&A

It seems the tests are running the zod schemas before the typescript checks are performed, otherwise we would run into typescript errors. But, as the image shows us, the first error cought is a ZodError.  
![#Q1](images/zod-prio.png)

