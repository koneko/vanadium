import { defineDb, defineTable, column } from 'astro:db';

const AnimeItem = defineTable({
  columns: {
    id: column.text({ primaryKey: true}),
    name: column.text(),
    aliases: column.text(),
    src: column.text()
  },
})

// https://astro.build/db/config
export default defineDb({
  tables: { AnimeItem }
});
