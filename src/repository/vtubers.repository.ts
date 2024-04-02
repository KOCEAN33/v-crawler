import { db } from '../database';

export async function getNewVtubers() {
  return db.selectFrom('youtubes').select(['status','url']).where('status','=','new').execute()
}