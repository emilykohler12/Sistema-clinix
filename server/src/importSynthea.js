import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import { Patient } from './models/Patient.js'
import { User } from './models/User.js'

// Uso: node src/importSynthea.js /ruta/a/csv 40
const csvDir = process.argv[2]
const sampleSize = parseInt(process.argv[3] || '40', 10)

if (!csvDir) {
  console.error('Uso: node src/importSynthea.js <carpeta-con-csv> [cantidad]')
  process.exit(1)
}

const conditionTranslations = {
  'Acute allergic reaction': 'Reacción alérgica aguda',
  'Acute bacterial sinusitis (disorder)': 'Sinusitis bacteriana aguda',
  'Acute bronchitis (disorder)': 'Bronquitis aguda',
  'Acute viral pharyngitis (disorder)': 'Faringitis viral aguda',
  'Alcoholism': 'Alcoholismo',
  "Alzheimer's disease (disorder)": 'Enfermedad de Alzheimer',
  'Anemia (disorder)': 'Anemia',
  'Antepartum eclampsia': 'Eclampsia anteparto',
  'Appendicitis': 'Apendicitis',
  'Atopic dermatitis': 'Dermatitis atópica',
  'Atrial Fibrillation': 'Fibrilación auricular',
  'Bleeding from anus': 'Sangrado anal',
  'Blighted ovum': 'Huevo anembrionado',
  'Body mass index 30+ - obesity (finding)': 'Obesidad (IMC 30+)',
  'Body mass index 40+ - severely obese (finding)': 'Obesidad severa (IMC 40+)',
  'Brain damage - traumatic': 'Daño cerebral traumático',
  'Bullet wound': 'Herida de bala',
  'Burn injury(morphologic abnormality)': 'Quemadura',
  'Carcinoma in situ of prostate (disorder)': 'Carcinoma in situ de próstata',
  'Cardiac Arrest': 'Paro cardíaco',
  'Child attention deficit disorder': 'Trastorno por déficit de atención infantil',
  'Childhood asthma': 'Asma infantil',
  'Chronic congestive heart failure (disorder)': 'Insuficiencia cardíaca congestiva crónica',
  'Chronic intractable migraine without aura': 'Migraña crónica intratable sin aura',
  'Chronic kidney disease stage 1 (disorder)': 'Enfermedad renal crónica etapa 1',
  'Chronic kidney disease stage 2 (disorder)': 'Enfermedad renal crónica etapa 2',
  'Chronic obstructive bronchitis (disorder)': 'Bronquitis obstructiva crónica',
  'Chronic pain': 'Dolor crónico',
  'Chronic sinusitis (disorder)': 'Sinusitis crónica',
  'Closed fracture of hip': 'Fractura cerrada de cadera',
  'Concussion injury of brain': 'Conmoción cerebral',
  'Concussion with loss of consciousness': 'Conmoción cerebral con pérdida de conciencia',
  'Concussion with no loss of consciousness': 'Conmoción cerebral sin pérdida de conciencia',
  'Contact dermatitis': 'Dermatitis de contacto',
  'Coronary Heart Disease': 'Enfermedad coronaria',
  'Cystitis': 'Cistitis',
  'Diabetes': 'Diabetes',
  'Diabetic renal disease (disorder)': 'Nefropatía diabética',
  'Diabetic retinopathy associated with type II diabetes mellitus (disorder)': 'Retinopatía diabética (diabetes tipo 2)',
  'Drug overdose': 'Sobredosis',
  'Epilepsy': 'Epilepsia',
  'Escherichia coli urinary tract infection': 'Infección urinaria por E. coli',
  'Facial laceration': 'Laceración facial',
  "Familial Alzheimer's disease of early onset (disorder)": 'Alzheimer familiar de inicio temprano',
  'Fetus with unknown complication': 'Feto con complicación desconocida',
  'First degree burn': 'Quemadura de primer grado',
  'Fracture of ankle': 'Fractura de tobillo',
  'Fracture of clavicle': 'Fractura de clavícula',
  'Fracture of forearm': 'Fractura de antebrazo',
  'Fracture of rib': 'Fractura de costilla',
  'Fracture of the vertebral column with spinal cord injury': 'Fractura vertebral con lesión medular',
  'Fracture of vertebral column without spinal cord injury': 'Fractura vertebral sin lesión medular',
  'Fracture subluxation of wrist': 'Fractura-subluxación de muñeca',
  'Gout': 'Gota',
  'History of appendectomy': 'Antecedente de apendicectomía',
  'History of cardiac arrest (situation)': 'Antecedente de paro cardíaco',
  'History of myocardial infarction (situation)': 'Antecedente de infarto de miocardio',
  'History of single seizure (situation)': 'Antecedente de convulsión única',
  'Hyperglycemia (disorder)': 'Hiperglucemia',
  'Hyperlipidemia': 'Hiperlipidemia',
  'Hypertension': 'Hipertensión',
  'Hypertriglyceridemia (disorder)': 'Hipertrigliceridemia',
  'Idiopathic atrophic hypothyroidism': 'Hipotiroidismo atrófico idiopático',
  'Impacted molars': 'Molares impactados',
  'Injury of anterior cruciate ligament': 'Lesión de ligamento cruzado anterior',
  'Injury of medial collateral ligament of knee': 'Lesión de ligamento colateral medial de rodilla',
  'Injury of tendon of the rotator cuff of shoulder': 'Lesión del manguito rotador',
  'Laceration of foot': 'Laceración de pie',
  'Laceration of forearm': 'Laceración de antebrazo',
  'Laceration of hand': 'Laceración de mano',
  'Laceration of thigh': 'Laceración de muslo',
  'Localized  primary osteoarthritis of the hand': 'Osteoartritis primaria localizada de mano',
  'Macular edema and retinopathy due to type 2 diabetes mellitus (disorder)': 'Edema macular y retinopatía (diabetes tipo 2)',
  'Major depression  single episode': 'Depresión mayor, episodio único',
  'Major depression disorder': 'Trastorno de depresión mayor',
  'Malignant neoplasm of breast (disorder)': 'Neoplasia maligna de mama',
  'Malignant tumor of colon': 'Tumor maligno de colon',
  'Metabolic syndrome X (disorder)': 'Síndrome metabólico',
  'Metastasis from malignant tumor of prostate (disorder)': 'Metástasis de tumor maligno de próstata',
  'Microalbuminuria due to type 2 diabetes mellitus (disorder)': 'Microalbuminuria (diabetes tipo 2)',
  'Miscarriage in first trimester': 'Aborto espontáneo en el primer trimestre',
  'Myocardial Infarction': 'Infarto de miocardio',
  'Neoplasm of prostate': 'Neoplasia de próstata',
  'Neuropathy due to type 2 diabetes mellitus (disorder)': 'Neuropatía diabética (tipo 2)',
  'Non-small cell carcinoma of lung  TNM stage 1 (disorder)': 'Carcinoma pulmonar no microcítico, estadio 1',
  'Non-small cell lung cancer (disorder)': 'Cáncer de pulmón no microcítico',
  'Nonproliferative diabetic retinopathy due to type 2 diabetes mellitus (disorder)': 'Retinopatía diabética no proliferativa',
  'Normal pregnancy': 'Embarazo normal',
  'Opioid abuse (disorder)': 'Abuso de opioides',
  'Osteoarthritis of hip': 'Osteoartritis de cadera',
  'Osteoarthritis of knee': 'Osteoartritis de rodilla',
  'Osteoporosis (disorder)': 'Osteoporosis',
  'Otitis media': 'Otitis media',
  'Overlapping malignant neoplasm of colon': 'Neoplasia maligna de colon (solapada)',
  'Pathological fracture due to osteoporosis (disorder)': 'Fractura patológica por osteoporosis',
  'Perennial allergic rhinitis': 'Rinitis alérgica perenne',
  'Perennial allergic rhinitis with seasonal variation': 'Rinitis alérgica perenne con variación estacional',
  'Pneumonia': 'Neumonía',
  'Polyp of colon': 'Pólipo de colon',
  'Prediabetes': 'Prediabetes',
  'Preeclampsia': 'Preeclampsia',
  'Primary fibromyalgia syndrome': 'Síndrome de fibromialgia primaria',
  'Primary malignant neoplasm of colon': 'Neoplasia maligna primaria de colon',
  'Primary small cell malignant neoplasm of lung  TNM stage 1 (disorder)': 'Carcinoma microcítico de pulmón, estadio 1',
  'Proliferative diabetic retinopathy due to type II diabetes mellitus (disorder)': 'Retinopatía diabética proliferativa',
  'Protracted diarrhea': 'Diarrea prolongada',
  'Pulmonary emphysema (disorder)': 'Enfisema pulmonar',
  'Pyelonephritis': 'Pielonefritis',
  'Recurrent rectal polyp': 'Pólipo rectal recurrente',
  'Recurrent urinary tract infection': 'Infección urinaria recurrente',
  'Rheumatoid arthritis': 'Artritis reumatoide',
  'Rupture of appendix': 'Ruptura de apéndice',
  'Rupture of patellar tendon': 'Ruptura del tendón rotuliano',
  'Seasonal allergic rhinitis': 'Rinitis alérgica estacional',
  'Second degree burn': 'Quemadura de segundo grado',
  'Secondary malignant neoplasm of colon': 'Neoplasia maligna secundaria de colon',
  'Seizure disorder': 'Trastorno convulsivo',
  'Sinusitis (disorder)': 'Sinusitis',
  'Small cell carcinoma of lung (disorder)': 'Carcinoma microcítico de pulmón',
  'Smokes tobacco daily': 'Fumador diario de tabaco',
  'Sprain of ankle': 'Esguince de tobillo',
  'Sprain of wrist': 'Esguince de muñeca',
  'Streptococcal sore throat (disorder)': 'Faringitis estreptocócica',
  'Stroke': 'Accidente cerebrovascular',
  'Suspected lung cancer (situation)': 'Sospecha de cáncer de pulmón',
  'Tear of meniscus of knee': 'Rotura de menisco de rodilla',
  'Tubal pregnancy': 'Embarazo tubárico',
  'Viral sinusitis (disorder)': 'Sinusitis viral',
  'Whiplash injury to neck': 'Latigazo cervical',
}

function translateCondition(desc) {
  return conditionTranslations[desc] || desc.replace(/\s*\((disorder|finding|situation|morphologic abnormality)\)\s*$/i, '')
}

function parseCsvLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n').filter(l => l.trim())
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line)
    const row = {}
    headers.forEach((h, i) => { row[h] = values[i] ?? '' })
    return row
  })
}

function cleanName(name) {
  return name.replace(/\d+$/, '').replace(/_/g, ' ').trim()
}

function digitsOnly(str, length) {
  const digits = (str || '').replace(/\D/g, '')
  return (digits + '00000000').slice(0, length)
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
function randomBloodType() {
  const weights = [34, 6, 9, 2, 4, 1, 38, 6]
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < bloodTypes.length; i++) {
    if (r < weights[i]) return bloodTypes[i]
    r -= weights[i]
  }
  return 'O+'
}

async function run() {
  await connectDB()

  const admin = await User.findOne({ role: 'admin' })
  if (!admin) {
    console.error('No se encontró un usuario admin. Corré primero npm run seed.')
    process.exit(1)
  }

  const patients = parseCsv(path.join(csvDir, 'patients.csv')).filter(p => !p.DEATHDATE)
  const conditions = parseCsv(path.join(csvDir, 'conditions.csv'))

  const conditionsByPatient = new Map()
  for (const c of conditions) {
    if (!conditionsByPatient.has(c.PATIENT)) conditionsByPatient.set(c.PATIENT, [])
    conditionsByPatient.get(c.PATIENT).push(c)
  }

  const shuffled = patients.sort(() => Math.random() - 0.5).slice(0, sampleSize)

  const docs = shuffled.map(p => {
    const patientConditions = conditionsByPatient.get(p.Id) || []
    const mainCondition = patientConditions[patientConditions.length - 1]
    const diagnosis = mainCondition ? translateCondition(mainCondition.DESCRIPTION) : ''
    const status = mainCondition
      ? (mainCondition.STOP ? 'de_alta' : 'en_tratamiento')
      : 'activo'

    return {
      name: `${cleanName(p.FIRST)} ${cleanName(p.LAST)}`.trim(),
      documentId: digitsOnly(p.SSN, 8),
      birthDate: p.BIRTHDATE || undefined,
      gender: p.GENDER === 'F' ? 'femenino' : p.GENDER === 'M' ? 'masculino' : 'otro',
      phone: '',
      email: '',
      address: '',
      bloodType: randomBloodType(),
      allergies: '',
      diagnosis,
      assignedDoctor: '',
      status,
      notes: '',
      avatar: '',
      createdBy: admin._id,
    }
  })

  const existingDocs = await Patient.find({ documentId: { $in: docs.map(d => d.documentId) } }).select('documentId')
  const existingIds = new Set(existingDocs.map(d => d.documentId))
  const newDocs = docs.filter(d => !existingIds.has(d.documentId))

  if (newDocs.length === 0) {
    console.log('No hay pacientes nuevos para insertar (ya importados).')
  } else {
    await Patient.insertMany(newDocs)
    console.log(`Se importaron ${newDocs.length} pacientes desde Synthea.`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

run().catch(err => {
  console.error('Error importando:', err)
  process.exit(1)
})
