import fs from 'fs';
import Papa from 'papaparse';

const csv = fs.readFileSync('hygdata_v42.csv', 'utf8');

const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
}).data;

const filtered = parsed
  .filter((star) => {
    const mag = Number(star.mag);
    return !isNaN(mag) && mag >= -1.2 && mag <= 4.5;
  })
  .map((star) => [
    Number(star.ra),
    Number(star.dec),
    Number(star.mag),
    Number(star.ci || 0),
    star.proper || '',
    Number(star.dist || 0),
    star.spect || '',
    star.con || '',
    Number(star.absmag || 0),
    Number(star.lum || 0),
    star.bayer || '',
    Number(star.flam || 0),
    star.var || '',
    Number(star.pmra || 0),
    Number(star.pmdec || 0),
    Number(star.rv || 0),
  ]);

fs.writeFileSync('../public/stars.json', JSON.stringify(filtered));

console.log(`Saved ${filtered.length} stars`);
