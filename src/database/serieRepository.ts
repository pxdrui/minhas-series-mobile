import { getDatabase } from './database';
import {
  Serie, CreateSerieInput, UpdateSerieInput, SerieFilter} from '../types/serie';

export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  const db = await getDatabase();

  if (filtro === 'todas') {
    return db.getAllAsync<Serie>(
      'SELECT * FROM series ORDER BY createdAt DESC'
    );
  }

  if (filtro === 'concluidas') {
    return db.getAllAsync<Serie>(
      'SELECT * FROM series WHERE concluida = 1 ORDER BY createdAt DESC'
    );
  }

  return db.getAllAsync<Serie>(
    'SELECT * FROM series WHERE concluida = 0 ORDER BY createdAt DESC'
  );
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = await getDatabase();
  const serie = await db.getFirstAsync<Serie>(
    'SELECT * FROM series WHERE id = ?',[id]);
  return serie ?? null;
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO series (
      titulo,
      plataforma,
      temporadas,
      nota,
      concluida,
      createdAt) 
    VALUES (?, ?, ?, ?, ?, ?)`, [input.titulo, input.plataforma, input.temporadas, input.nota, 0, createdAt,]
  );

  const serie = await getSerieById(result.lastInsertRowId);
  if (serie === null) {
    throw new Error('Erro ao criar série.');
  }
  return serie;
}

export async function updateSerie(id: number, input: UpdateSerieInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE series
     SET titulo = ?,
         plataforma = ?,
         temporadas = ?,
         nota = ?
     WHERE id = ?`,
    [input.titulo, input.plataforma, input.temporadas, input.nota, id,]);
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE series
     SET concluida = CASE
       WHEN concluida = 0 THEN 1
       ELSE 0
     END WHERE id = ?`,[id]);
}

export async function deleteSerie(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'DELETE FROM series WHERE id = ?',[id]);
}