export interface Department {
  id: string;
  name: string;
  code: string;
  maxLevel?: number; // default 400, 500 for engineering/vet
}

export interface College {
  id: string;
  code: string; // e.g. COLPHYS, COLBIOS
  name: string;
  fullName: string;
  departments: Department[];
}

export interface StudyDocument {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  fileName: string;
  fileSize: string;
  category: 'course_materials' | 'past_questions' | 'solutions';
  semester: 'First Semester' | 'Second Semester';
  year?: string;
  uploadedBy: string;
  verified: boolean;
  downloads: number;
  previewSnippet: string;
  fileUrl?: string;
  fileType?: string;
}

export const ALL_COLLEGES: College[] = [
  {
    id: 'colphys',
    code: 'COLPHYS',
    name: 'Physical Sciences',
    fullName: 'College of Physical Sciences',
    departments: [
      { id: 'computer-science', code: 'CSC', name: 'Computer Science', maxLevel: 400 },
      { id: 'physics', code: 'PHS', name: 'Physics', maxLevel: 400 },
      { id: 'mathematics', code: 'MTS', name: 'Mathematics', maxLevel: 400 },
      { id: 'statistics', code: 'STS', name: 'Statistics', maxLevel: 400 },
      { id: 'chemistry', code: 'CHM', name: 'Chemistry', maxLevel: 400 },
    ],
  },
  {
    id: 'colbios',
    code: 'COLBIOS',
    name: 'Biosciences',
    fullName: 'College of Biosciences',
    departments: [
      { id: 'biochemistry', code: 'BCH', name: 'Biochemistry', maxLevel: 400 },
      { id: 'microbiology', code: 'MCB', name: 'Microbiology', maxLevel: 400 },
      { id: 'pure-applied-zoology', code: 'PAZ', name: 'Pure & Applied Zoology', maxLevel: 400 },
      { id: 'pure-applied-botany', code: 'PAB', name: 'Pure & Applied Botany', maxLevel: 400 },
    ],
  },
  {
    id: 'coleng',
    code: 'COLENG',
    name: 'Engineering',
    fullName: 'College of Engineering',
    departments: [
      { id: 'mechanical-engineering', code: 'MCE', name: 'Mechanical Engineering', maxLevel: 500 },
      { id: 'electrical-engineering', code: 'ELE', name: 'Electrical & Electronics Engineering', maxLevel: 500 },
      { id: 'civil-engineering', code: 'CVE', name: 'Civil Engineering', maxLevel: 500 },
      { id: 'agricultural-engineering', code: 'AGE', name: 'Agricultural & Bio-Resources Engineering', maxLevel: 500 },
      { id: 'mechatronics-engineering', code: 'MTE', name: 'Mechatronics Engineering', maxLevel: 500 },
    ],
  },
  {
    id: 'colvet',
    code: 'COLVET',
    name: 'Veterinary Medicine',
    fullName: 'College of Veterinary Medicine',
    departments: [
      { id: 'veterinary-medicine', code: 'VTM', name: 'Veterinary Medicine & Surgery', maxLevel: 500 },
      { id: 'veterinary-anatomy', code: 'VTA', name: 'Veterinary Anatomy', maxLevel: 500 },
      { id: 'veterinary-pathology', code: 'VTP', name: 'Veterinary Pathology', maxLevel: 500 },
      { id: 'veterinary-microbiology', code: 'VTM', name: 'Veterinary Microbiology & Parasitology', maxLevel: 500 },
    ],
  },
  {
    id: 'colplant',
    code: 'COLPLANT',
    name: 'Plant Science & Crop Production',
    fullName: 'College of Plant Science and Crop Production',
    departments: [
      { id: 'crop-production', code: 'CPT', name: 'Crop Production & Protection', maxLevel: 500 },
      { id: 'plant-breeding', code: 'PBG', name: 'Plant Breeding & Seed Technology', maxLevel: 500 },
      { id: 'horticulture', code: 'HRT', name: 'Horticulture', maxLevel: 500 },
      { id: 'soil-science', code: 'SOS', name: 'Soil Science & Land Management', maxLevel: 500 },
    ],
  },
  {
    id: 'colanim',
    code: 'COLANIM',
    name: 'Animal Science & Livestock Production',
    fullName: 'College of Animal Science and Livestock Production',
    departments: [
      { id: 'animal-nutrition', code: 'ANN', name: 'Animal Nutrition', maxLevel: 500 },
      { id: 'animal-breeding', code: 'ABG', name: 'Animal Breeding & Genetics', maxLevel: 500 },
      { id: 'animal-production', code: 'APH', name: 'Animal Production & Health', maxLevel: 500 },
      { id: 'pasture-range', code: 'PRM', name: 'Pasture & Range Management', maxLevel: 500 },
    ],
  },
  {
    id: 'colmas',
    code: 'COLMAS',
    name: 'Management Sciences',
    fullName: 'College of Management Sciences',
    departments: [
      { id: 'accounting', code: 'ACC', name: 'Accounting', maxLevel: 400 },
      { id: 'business-administration', code: 'BUS', name: 'Business Administration', maxLevel: 400 },
      { id: 'banking-finance', code: 'BFN', name: 'Banking & Finance', maxLevel: 400 },
      { id: 'economics', code: 'ECO', name: 'Economics', maxLevel: 400 },
    ],
  },
  {
    id: 'colamrud',
    code: 'COLAMRUD',
    name: 'Agricultural Management',
    fullName: 'College of Agricultural Management & Rural Development',
    departments: [
      { id: 'agricultural-economics', code: 'AEC', name: 'Agricultural Economics & Farm Management', maxLevel: 500 },
      { id: 'agricultural-extension', code: 'AER', name: 'Agricultural Extension & Rural Development', maxLevel: 500 },
      { id: 'communication-studies', code: 'AGS', name: 'Agricultural Communication & General Studies', maxLevel: 500 },
    ],
  },
  {
    id: 'colfhec',
    code: 'COLFHEC',
    name: 'Food Science & Human Ecology',
    fullName: 'College of Food Science and Human Ecology',
    departments: [
      { id: 'food-science', code: 'FST', name: 'Food Science & Technology', maxLevel: 500 },
      { id: 'nutrition-dietetics', code: 'NTD', name: 'Nutrition & Dietetics', maxLevel: 500 },
      { id: 'home-science', code: 'HSM', name: 'Home Science & Management', maxLevel: 500 },
    ],
  },
  {
    id: 'colerm',
    code: 'COLERM',
    name: 'Environmental Resources Management',
    fullName: 'College of Environmental Resources Management',
    departments: [
      { id: 'forestry-wildlife', code: 'FWM', name: 'Forestry & Wildlife Management', maxLevel: 500 },
      { id: 'water-resources', code: 'WMA', name: 'Water Resources Management & Agrometeorology', maxLevel: 500 },
      { id: 'aquaculture-fisheries', code: 'AQF', name: 'Aquaculture & Fisheries Management', maxLevel: 500 },
      { id: 'environmental-management', code: 'EMT', name: 'Environmental Management & Toxicology', maxLevel: 500 },
    ],
  },
];

export const STARTER_COLLEGES = ALL_COLLEGES;

// Helper to find College by code or id (case-insensitive)
export function getCollegeByCodeOrId(identifier: string): College | undefined {
  const norm = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
  return ALL_COLLEGES.find(
    (c) =>
      c.code.toLowerCase() === norm ||
      c.id.toLowerCase() === norm ||
      c.code.toLowerCase().replace(/[^a-z0-9]/g, '') === norm
  );
}

// Helper to find Department within a College
export function getDepartmentBySlug(college: College, deptSlug: string): Department | undefined {
  const norm = deptSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  return college.departments.find(
    (d) =>
      d.id.toLowerCase().replace(/[^a-z0-9]/g, '') === norm ||
      d.name.toLowerCase().replace(/[^a-z0-9]/g, '') === norm ||
      d.code.toLowerCase() === norm
  );
}

// Level Materials Generator
export function getMaterialsForLevel(
  departmentName: string,
  deptCode: string,
  level: number
): StudyDocument[] {
  const isCsc =
    deptCode?.toUpperCase() === 'CSC' ||
    departmentName.toLowerCase().includes('computer');

  if (isCsc) {
    if (level === 100) {
      return [
        // 1. Course Materials
        {
          id: 'csc-100-mat-1',
          title: 'CSC 101 - Introduction to Computer Science & Problem Solving',
          courseCode: 'CSC 101',
          courseTitle: 'Introduction to Computer Science',
          fileName: 'CSC_101_Intro_To_Computer_Science.pdf',
          fileSize: '3.8 MB',
          category: 'course_materials',
          semester: 'First Semester',
          year: '2025/2026',
          uploadedBy: 'Course Rep Desk • FUNAAB',
          verified: true,
          downloads: 1420,
          previewSnippet: `CSC 101: History of computing, generations of computers, computer hardware architecture (von Neumann), software classification, number systems (binary, octal, hex), Boolean logic, and introduction to flowcharting & pseudocode algorithms.`,
        },
        {
          id: 'csc-100-mat-2',
          title: 'CSC 102 - JavaScript & Basic Web Programming Handbook',
          courseCode: 'CSC 102',
          courseTitle: 'Fundamentals of Web Technologies & JavaScript',
          fileName: 'CSC_102_JavaScript_Web_Basics.pdf',
          fileSize: '4.2 MB',
          category: 'course_materials',
          semester: 'Second Semester',
          year: '2025/2026',
          uploadedBy: 'FUNAAB Computer Science Lab Technologist',
          verified: true,
          downloads: 1180,
          previewSnippet: `CSC 102: HTML5 semantics, modern CSS3 layouts (flexbox, grid), JavaScript ES6 syntax, DOM manipulation, events, asynchronous JavaScript (promises, fetch API), and building responsive student portal interfaces.`,
        },
        {
          id: 'csc-100-mat-3',
          title: 'CSC 103 - Computer Hardware & Assembly Architecture Handbook',
          courseCode: 'CSC 103',
          courseTitle: 'Computer Hardware Fundamentals',
          fileName: 'CSC_103_Computer_Architecture.pdf',
          fileSize: '5.1 MB',
          category: 'course_materials',
          semester: 'First Semester',
          year: '2025/2026',
          uploadedBy: 'Hardware Systems Lab',
          verified: true,
          downloads: 870,
          previewSnippet: `CSC 103: CPU registers, ALU operations, memory hierarchies (cache, RAM, virtual memory), buses, I/O devices, machine cycle, and basic assembly instructions.`,
        },
        {
          id: 'csc-100-mat-4',
          title: 'MTS 101 - Elementary Mathematics I (Calculus & Algebra)',
          courseCode: 'MTS 101',
          courseTitle: 'Elementary Mathematics I',
          fileName: 'MTS_101_Calculus_Algebra.pdf',
          fileSize: '6.4 MB',
          category: 'course_materials',
          semester: 'First Semester',
          year: '2024/2025',
          uploadedBy: 'COLPHYS Mathematics Unit',
          verified: true,
          downloads: 1890,
          previewSnippet: `MTS 101: Set theory, mappings, polynomials, quadratic equations, mathematical induction, limits, continuity, differentiation from first principles, and integration techniques.`,
        },
        {
          id: 'csc-100-mat-5',
          title: 'PHS 105 - General Physics for Physical Sciences & Computing',
          courseCode: 'PHS 105',
          courseTitle: 'General Physics I (Mechanics & Properties of Matter)',
          fileName: 'PHS_105_General_Physics.pdf',
          fileSize: '4.9 MB',
          category: 'course_materials',
          semester: 'First Semester',
          year: '2024/2025',
          uploadedBy: 'COLPHYS Physics Dept',
          verified: true,
          downloads: 1340,
          previewSnippet: `PHS 105: Units and dimensions, vectors, kinematics, Newton's laws of motion, conservation of momentum and energy, rotational dynamics, gravitation, and elasticity.`,
        },

        // 2. Past Questions
        {
          id: 'csc-100-pq-1',
          title: 'CSC 101 - 2023/2024 First Semester Examination Paper',
          courseCode: 'CSC 101',
          courseTitle: 'Introduction to Computer Science Finals',
          fileName: 'CSC_101_Exam_2023_2024.pdf',
          fileSize: '1.2 MB',
          category: 'past_questions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Academic Vault Archivist',
          verified: true,
          downloads: 2100,
          previewSnippet: `FEDERAL UNIVERSITY OF AGRICULTURE, ABEOKUTA\nCOLLEGE OF PHYSICAL SCIENCES (COLPHYS)\nDEPARTMENT OF COMPUTER SCIENCE\nFIRST SEMESTER EXAMINATION 2023/2024\nCOURSE CODE: CSC 101 | TIME: 2 Hours\nINSTRUCTIONS: Answer Question 1 and any other THREE questions.`,
        },
        {
          id: 'csc-100-pq-2',
          title: 'CSC 102 - 2023/2024 JavaScript & Web Programming Exam Paper',
          courseCode: 'CSC 102',
          courseTitle: 'Web Fundamentals & JavaScript Exam',
          fileName: 'CSC_102_Exam_2023_2024.pdf',
          fileSize: '1.5 MB',
          category: 'past_questions',
          semester: 'Second Semester',
          year: '2023/2024',
          uploadedBy: 'Course Rep Archives',
          verified: true,
          downloads: 1650,
          previewSnippet: `FEDERAL UNIVERSITY OF AGRICULTURE, ABEOKUTA\nDEPARTMENT OF COMPUTER SCIENCE\nSECOND SEMESTER EXAMINATION 2023/2024\nCOURSE CODE: CSC 102 | TIME: 2 Hours 30 Mins\nWrite JavaScript code to validate a student registration form and dynamically render a course summary table.`,
        },
        {
          id: 'csc-100-pq-3',
          title: 'CSC 101 - 2022/2023 First Semester Examination Paper',
          courseCode: 'CSC 101',
          courseTitle: 'Intro to Computer Science Exam 2022/2023',
          fileName: 'CSC_101_Exam_2022_2023.pdf',
          fileSize: '1.1 MB',
          category: 'past_questions',
          semester: 'First Semester',
          year: '2022/2023',
          uploadedBy: 'Academic Vault Archivist',
          verified: true,
          downloads: 1320,
          previewSnippet: `FEDERAL UNIVERSITY OF AGRICULTURE, ABEOKUTA\nCOURSE: CSC 101 - Introduction to Computer Science\nConvert (375.625)10 to binary, octal, and hexadecimal. Explain the Fetch-Decode-Execute cycle with clear diagrams.`,
        },
        {
          id: 'csc-100-pq-4',
          title: 'MTS 101 - 2023/2024 First Semester Examination Paper',
          courseCode: 'MTS 101',
          courseTitle: 'Calculus & Elementary Mathematics Exam',
          fileName: 'MTS_101_Exam_2023_2024.pdf',
          fileSize: '1.4 MB',
          category: 'past_questions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'COLPHYS Vault',
          verified: true,
          downloads: 1980,
          previewSnippet: `DEPARTMENT OF MATHEMATICS • FUNAAB\nMTS 101 Examination: Find the limit as x approaches 0 of sin(5x)/3x. Differentiate f(x) = ln(x^2 + 4) using chain rule.`,
        },

        // 3. Solutions & Answers to Past Questions
        {
          id: 'csc-100-sol-1',
          title: 'CSC 101 - 2023/2024 Detailed Step-by-Step Solutions & Guide',
          courseCode: 'CSC 101',
          courseTitle: 'Full Solutions for CSC 101 Examination',
          fileName: 'CSC_101_Solutions_2023_2024.pdf',
          fileSize: '3.6 MB',
          category: 'solutions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Faculty Peer Reviewers',
          verified: true,
          downloads: 2450,
          previewSnippet: `CSC 101 WORKED SOLUTION KEY:\nQuestion 1(a): Complete binary conversion table showing repeated division & fractional multiplication steps.\nQuestion 1(b): ASCII vs Unicode comparison matrix with byte encoding schemes.\nQuestion 2: Detailed von Neumann block diagram with bus interconnects.`,
        },
        {
          id: 'csc-100-sol-2',
          title: 'CSC 102 - JavaScript Practical Coding Solutions & Trace Guide',
          courseCode: 'CSC 102',
          courseTitle: 'Official Solutions & Code Snippets for CSC 102',
          fileName: 'CSC_102_JavaScript_Solutions.pdf',
          fileSize: '2.8 MB',
          category: 'solutions',
          semester: 'Second Semester',
          year: '2023/2024',
          uploadedBy: 'Tutor Guild • CSC FUNAAB',
          verified: true,
          downloads: 1820,
          previewSnippet: `CSC 102 WORKED CODE REPOSITORY:\nComplete, fully commented modern JavaScript solutions for DOM querying, input regex sanitization, promise chaining, and error boundary implementation.`,
        },
        {
          id: 'csc-100-sol-3',
          title: 'CSC 101 - 5-Year Past Examination Solved Master Key (2019–2024)',
          courseCode: 'CSC 101',
          courseTitle: 'Comprehensive 5-Year Question & Answer Vault',
          fileName: 'CSC_101_5Year_Solved_Key.pdf',
          fileSize: '7.8 MB',
          category: 'solutions',
          semester: 'First Semester',
          year: '2024 Edition',
          uploadedBy: 'Departmental Academic Committee',
          verified: true,
          downloads: 3200,
          previewSnippet: `CSC 101 MASTER SOLVED COMPENDIUM:\nComprehensive 5-year archive covering every recurring exam concept: number base conversions, algorithm complexity, memory architectures, Boolean minimization using Karnaugh maps.`,
        },
        {
          id: 'csc-100-sol-4',
          title: 'MTS 101 - Worked Calculus & Algebra Solutions Pack',
          courseCode: 'MTS 101',
          courseTitle: 'Step-by-Step Calculus Proofs & Exam Marking Guide',
          fileName: 'MTS_101_Worked_Solutions.pdf',
          fileSize: '4.5 MB',
          category: 'solutions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Math Study Circles',
          verified: true,
          downloads: 2310,
          previewSnippet: `MTS 101 CALCULUS SOLUTIONS:\nDetailed handwritten & LaTeX rendered derivations for limits, derivatives, integration by substitution, and partial fractions with scoring rubrics.`,
        },
      ];
    }

    if (level === 200) {
      return [
        // Course Materials
        {
          id: 'csc-200-mat-1',
          title: 'CSC 201 - Structured Programming & C++ Coursepack',
          courseCode: 'CSC 201',
          courseTitle: 'Structured Programming in C++',
          fileName: 'CSC_201_Programming_In_Cpp.pdf',
          fileSize: '4.1 MB',
          category: 'course_materials',
          semester: 'First Semester',
          year: '2025/2026',
          uploadedBy: 'Software Engineering Unit',
          verified: true,
          downloads: 980,
          previewSnippet: `CSC 201: C++ fundamentals, pointers and memory addresses, structs, classes, encapsulation, inheritance, polymorphism, templates, and dynamic memory allocation.`,
        },
        {
          id: 'csc-200-mat-2',
          title: 'CSC 202 - Data Structures & Algorithms Compendium',
          courseCode: 'CSC 202',
          courseTitle: 'Data Structures & Algorithms',
          fileName: 'CSC_202_Data_Structures.pdf',
          fileSize: '5.6 MB',
          category: 'course_materials',
          semester: 'Second Semester',
          year: '2025/2026',
          uploadedBy: 'Algorithms Faculty Lab',
          verified: true,
          downloads: 1250,
          previewSnippet: `CSC 202: Asymptotic notation (Big O, Omega, Theta), Arrays, Linked Lists, Stacks, Queues, Binary Search Trees, AVL Trees, Heaps, Hashing, Graph Traversals (BFS, DFS), and Sorting algorithms.`,
        },
        {
          id: 'csc-200-mat-3',
          title: 'CSC 205 - Operating Systems Foundations & UNIX Commands',
          courseCode: 'CSC 205',
          courseTitle: 'Operating Systems Principles',
          fileName: 'CSC_205_Operating_Systems.pdf',
          fileSize: '3.9 MB',
          category: 'course_materials',
          semester: 'First Semester',
          year: '2025/2026',
          uploadedBy: 'Systems Lab Desk',
          verified: true,
          downloads: 840,
          previewSnippet: `CSC 205: Process management, CPU scheduling algorithms, threads, deadlocks, memory management (paging, segmentation), and file systems.`,
        },

        // Past Questions
        {
          id: 'csc-200-pq-1',
          title: 'CSC 201 - 2023/2024 C++ Examination Paper',
          courseCode: 'CSC 201',
          courseTitle: 'Structured Programming Finals',
          fileName: 'CSC_201_Exam_2023_2024.pdf',
          fileSize: '1.3 MB',
          category: 'past_questions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Academic Vault Archivist',
          verified: true,
          downloads: 1540,
          previewSnippet: `FEDERAL UNIVERSITY OF AGRICULTURE, ABEOKUTA\nDEPARTMENT OF COMPUTER SCIENCE\nCSC 201 Exam: Write a C++ class representing a BankAccount with deposit, withdraw, and transaction logging methods.`,
        },
        {
          id: 'csc-200-pq-2',
          title: 'CSC 202 - 2023/2024 Data Structures Examination Paper',
          courseCode: 'CSC 202',
          courseTitle: 'Data Structures & Algorithms Finals',
          fileName: 'CSC_202_Exam_2023_2024.pdf',
          fileSize: '1.6 MB',
          category: 'past_questions',
          semester: 'Second Semester',
          year: '2023/2024',
          uploadedBy: 'Academic Vault Archivist',
          verified: true,
          downloads: 1720,
          previewSnippet: `CSC 202 EXAM: Given a sequence of keys, construct a Binary Search Tree. Show tree balancing rotations for AVL insertion.`,
        },

        // Solutions
        {
          id: 'csc-200-sol-1',
          title: 'CSC 201 - C++ Programming Solutions & Code Traces',
          courseCode: 'CSC 201',
          courseTitle: 'Verified C++ Exam Code & Solutions',
          fileName: 'CSC_201_Cpp_Solutions.pdf',
          fileSize: '3.1 MB',
          category: 'solutions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Faculty Peer Reviewers',
          verified: true,
          downloads: 1670,
          previewSnippet: `CSC 201 WORKED SOLUTIONS: Clean C++ source code with inline memory layout analysis, pointer arithmetic explanations, and operator overloading solutions.`,
        },
        {
          id: 'csc-200-sol-2',
          title: 'CSC 202 - Data Structures Worked Trees, Stacks & Queue Solutions',
          courseCode: 'CSC 202',
          courseTitle: 'Step-by-Step Data Structures Answer Guide',
          fileName: 'CSC_202_DS_Worked_Solutions.pdf',
          fileSize: '4.2 MB',
          category: 'solutions',
          semester: 'Second Semester',
          year: '2023/2024',
          uploadedBy: 'Tutor Guild • CSC FUNAAB',
          verified: true,
          downloads: 1890,
          previewSnippet: `CSC 202 SOLUTIONS: Illustrated diagrams for AVL single and double rotations, heapify operations, Dijkstra shortest path table trace, and Big-O proofs.`,
        },
      ];
    }

    if (level === 300) {
      return [
        // Course Materials
        {
          id: 'csc-300-mat-1',
          title: 'CSC 301 - Database Systems & Relational Modeling (SQL)',
          courseCode: 'CSC 301',
          courseTitle: 'Database Systems Design & SQL',
          fileName: 'CSC_301_Database_Systems_SQL.pdf',
          fileSize: '5.2 MB',
          category: 'course_materials',
          semester: 'First Semester',
          year: '2025/2026',
          uploadedBy: 'Database Systems Research Lab',
          verified: true,
          downloads: 1100,
          previewSnippet: `CSC 301: Relational algebra, Entity-Relationship modeling, normalization (1NF, 2NF, 3NF, BCNF), transaction concurrency (ACID), and SQL query optimization.`,
        },
        {
          id: 'csc-300-mat-2',
          title: 'CSC 305 - Software Engineering Methodologies & Agile Sprint Guide',
          courseCode: 'CSC 305',
          courseTitle: 'Software Engineering Principles',
          fileName: 'CSC_305_Software_Engineering.pdf',
          fileSize: '4.5 MB',
          category: 'course_materials',
          semester: 'First Semester',
          year: '2025/2026',
          uploadedBy: 'Software Engineering Unit',
          verified: true,
          downloads: 940,
          previewSnippet: `CSC 305: SDLC phases, Agile/Scrum, requirement elicitation, UML diagrams (use case, sequence, class), software testing (unit, integration), and CI/CD pipelines.`,
        },
        {
          id: 'csc-300-mat-3',
          title: 'CSC 311 - Artificial Intelligence & Search Algorithms',
          courseCode: 'CSC 311',
          courseTitle: 'Introduction to Artificial Intelligence',
          fileName: 'CSC_311_Artificial_Intelligence.pdf',
          fileSize: '4.8 MB',
          category: 'course_materials',
          semester: 'Second Semester',
          year: '2024/2025',
          uploadedBy: 'AI & Data Science Hub',
          verified: true,
          downloads: 1310,
          previewSnippet: `CSC 311: Intelligent agents, state space search, heuristic search (A*, greedy best-first), minimax with alpha-beta pruning, knowledge representation, and introductory neural networks.`,
        },

        // Past Questions
        {
          id: 'csc-300-pq-1',
          title: 'CSC 301 - 2023/2024 Database Systems Examination Paper',
          courseCode: 'CSC 301',
          courseTitle: 'Database Systems Finals',
          fileName: 'CSC_301_Exam_2023_2024.pdf',
          fileSize: '1.4 MB',
          category: 'past_questions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Academic Vault Archivist',
          verified: true,
          downloads: 1410,
          previewSnippet: `CSC 301 EXAM: Given a university schema with tables Students, Courses, and Enrollments, write SQL queries for complex joins, aggregations, and subqueries. Normalize an un-normalized schema to 3NF.`,
        },
        {
          id: 'csc-300-pq-2',
          title: 'CSC 305 - 2023/2024 Software Engineering Exam Paper',
          courseCode: 'CSC 305',
          courseTitle: 'Software Engineering Finals',
          fileName: 'CSC_305_Exam_2023_2024.pdf',
          fileSize: '1.2 MB',
          category: 'past_questions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Academic Vault Archivist',
          verified: true,
          downloads: 1120,
          previewSnippet: `CSC 305 EXAM: Draw a comprehensive UML sequence diagram for user authentication with JWT token refresh. Compare Waterfall vs Scrum methodologies for safety-critical systems.`,
        },

        // Solutions
        {
          id: 'csc-300-sol-1',
          title: 'CSC 301 - SQL Queries & Normalization Step-by-Step Solutions',
          courseCode: 'CSC 301',
          courseTitle: 'Worked SQL Queries & Relational Decomposition',
          fileName: 'CSC_301_SQL_Solutions.pdf',
          fileSize: '3.7 MB',
          category: 'solutions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Faculty Peer Reviewers',
          verified: true,
          downloads: 1750,
          previewSnippet: `CSC 301 SOLUTIONS: Complete SQL solutions with syntax verification, dependency diagrams for normalization up to BCNF, and ER diagram design solutions.`,
        },
        {
          id: 'csc-300-sol-2',
          title: 'CSC 305 - Software Engineering Case Study Answers & UML Diagrams',
          courseCode: 'CSC 305',
          courseTitle: 'Marking Scheme & Software Design Solutions',
          fileName: 'CSC_305_SE_Solutions.pdf',
          fileSize: '3.2 MB',
          category: 'solutions',
          semester: 'First Semester',
          year: '2023/2024',
          uploadedBy: 'Tutor Guild • CSC FUNAAB',
          verified: true,
          downloads: 1390,
          previewSnippet: `CSC 305 SOLUTIONS: Full model answers for architectural design questions, design pattern examples (Factory, Singleton, Observer), and test cases for boundary value analysis.`,
        },
      ];
    }

    // level === 400 (Senior Capstone)
    return [
      // Course Materials
      {
        id: 'csc-400-mat-1',
        title: 'CSC 405 - Formal Methods in Software Development & Z Specification',
        courseCode: 'CSC 405',
        courseTitle: 'Formal Methods in Software Development',
        fileName: 'CSC_405_Formal_Methods_Handbook.pdf',
        fileSize: '4.7 MB',
        category: 'course_materials',
        semester: 'First Semester',
        year: '2025/2026',
        uploadedBy: 'Formal Methods & Logic Research Group',
        verified: true,
        downloads: 850,
        previewSnippet: `CSC 405: Mathematical modeling of software systems, propositional and predicate logic, set theory and relations, Z notation schema calculus, pre-conditions and post-conditions, and formal verification proofs.`,
      },
      {
        id: 'csc-400-mat-2',
        title: 'CSC 411 - Compiler Construction & Syntax Trees',
        courseCode: 'CSC 411',
        courseTitle: 'Compiler Design & Construction',
        fileName: 'CSC_411_Compiler_Construction.pdf',
        fileSize: '5.4 MB',
        category: 'course_materials',
        semester: 'First Semester',
        year: '2025/2026',
        uploadedBy: 'Programming Languages Lab',
        verified: true,
        downloads: 730,
        previewSnippet: `CSC 411: Lexical analysis (lex, regular expressions, DFA), syntax analysis (LL and LR parsing, Yacc/Bison), abstract syntax trees, semantic analysis, type checking, intermediate code generation, and optimization.`,
      },
      {
        id: 'csc-400-mat-3',
        title: 'CSC 421 - Distributed Systems & Cloud Computing Architectures',
        courseCode: 'CSC 421',
        courseTitle: 'Distributed Systems Principles',
        fileName: 'CSC_421_Distributed_Systems.pdf',
        fileSize: '4.9 MB',
        category: 'course_materials',
        semester: 'Second Semester',
        year: '2024/2025',
        uploadedBy: 'Cloud & Distributed Systems Hub',
        verified: true,
        downloads: 910,
        previewSnippet: `CSC 421: Distributed computing models, RPC, distributed consensus (Raft, Paxos), CAP theorem, distributed storage, fault tolerance, and microservice architectures.`,
      },

      // Past Questions
      {
        id: 'csc-400-pq-1',
        title: 'CSC 405 - 2023/2024 Formal Methods Examination Paper',
        courseCode: 'CSC 405',
        courseTitle: 'Formal Methods Final Examination Paper',
        fileName: 'CSC_405_Exam_2023_2024.pdf',
        fileSize: '1.3 MB',
        category: 'past_questions',
        semester: 'First Semester',
        year: '2023/2024',
        uploadedBy: 'Academic Vault Archivist',
        verified: true,
        downloads: 1250,
        previewSnippet: `FEDERAL UNIVERSITY OF AGRICULTURE, ABEOKUTA\nCOLLEGE OF PHYSICAL SCIENCES (COLPHYS)\nDEPARTMENT OF COMPUTER SCIENCE\nFINAL B.SC. EXAMINATION 2023/2024\nCOURSE CODE: CSC 405 - Formal Methods\nWrite a complete Z specification schema for a Library lending system with invariant checks.`,
      },
      {
        id: 'csc-400-pq-2',
        title: 'CSC 411 - 2023/2024 Compiler Construction Examination Paper',
        courseCode: 'CSC 411',
        courseTitle: 'Compiler Construction Final Exam Paper',
        fileName: 'CSC_411_Exam_2023_2024.pdf',
        fileSize: '1.5 MB',
        category: 'past_questions',
        semester: 'First Semester',
        year: '2023/2024',
        uploadedBy: 'Academic Vault Archivist',
        verified: true,
        downloads: 990,
        previewSnippet: `CSC 411 EXAM: Construct an SLR(1) parsing table for the specified grammar. Trace the shift-reduce steps for input string w = id + id * id.`,
      },

      // Solutions
      {
        id: 'csc-400-sol-1',
        title: 'CSC 405 - Formal Methods & Schema Calculus Step-by-Step Solutions',
        courseCode: 'CSC 405',
        courseTitle: 'Full Solutions & Z Proofs for CSC 405',
        fileName: 'CSC_405_Formal_Methods_Solutions.pdf',
        fileSize: '3.9 MB',
        category: 'solutions',
        semester: 'First Semester',
        year: '2023/2024',
        uploadedBy: 'Faculty Peer Reviewers',
        verified: true,
        downloads: 1490,
        previewSnippet: `CSC 405 SOLUTIONS: Detailed schema definitions for state space, initialization schema, delta and xi operations, accompanied by rigorous inductive proofs of consistency.`,
      },
      {
        id: 'csc-400-sol-2',
        title: 'CSC 411 - Compiler Lexing & Parsing Worked Exam Solutions',
        courseCode: 'CSC 411',
        courseTitle: 'LR Parsing Tables & Syntax Tree Solutions',
        fileName: 'CSC_411_Compiler_Solutions.pdf',
        fileSize: '4.4 MB',
        category: 'solutions',
        semester: 'First Semester',
        year: '2023/2024',
        uploadedBy: 'Tutor Guild • CSC FUNAAB',
        verified: true,
        downloads: 1180,
        previewSnippet: `CSC 411 SOLUTIONS: Step-by-step NFA to DFA subset construction table, FIRST and FOLLOW sets computation, LR(1) canonical collection items, and syntax tree drawings.`,
      },
    ];
  }

  // Generic generator for other departments (Veterinary, Engineering, Biosciences, Agriculture, etc.)
  const prefix = deptCode || departmentName.slice(0, 3).toUpperCase();

  return [
    // 1. COURSE MATERIALS
    {
      id: `${prefix.toLowerCase()}-${level}-mat-1`,
      title: `${prefix} ${level}1 - Comprehensive Lecture Notes & Slides`,
      courseCode: `${prefix} ${level}1`,
      courseTitle: `Introduction to ${departmentName} Principles`,
      fileName: `${prefix}_${level}1_Lecture_Notes_2025.pdf`,
      fileSize: '3.4 MB',
      category: 'course_materials',
      semester: 'First Semester',
      year: '2025/2026',
      uploadedBy: 'Course Rep Desk • FUNAAB',
      verified: true,
      downloads: 412,
      previewSnippet: `SYLLABUS & MODULE OUTLINE: Chapter 1 - Fundamental Core Concepts in ${departmentName}. Chapter 2 - Problem formulation, mathematical foundations, practical case studies, and lab experimentation protocol.`,
    },
    {
      id: `${prefix.toLowerCase()}-${level}-mat-2`,
      title: `${prefix} ${level}2 - Laboratory Manual & Practical Handbook`,
      courseCode: `${prefix} ${level}2`,
      courseTitle: `Laboratory Experiments & Practicals in ${departmentName}`,
      fileName: `${prefix}_${level}2_Lab_Manual.pdf`,
      fileSize: '4.8 MB',
      category: 'course_materials',
      semester: 'First Semester',
      year: '2025/2026',
      uploadedBy: 'Departmental Lab Technologist',
      verified: true,
      downloads: 298,
      previewSnippet: `EXPERIMENT GUIDE: Standard safety protocol, experimental design, instrument calibration, data collection matrices, error analysis, and formal report template.`,
    },
    {
      id: `${prefix.toLowerCase()}-${level}-mat-3`,
      title: `GNS ${level > 200 ? '201' : '101'} - General Studies Companion & Reading Pack`,
      courseCode: level > 200 ? 'GNS 201' : 'GNS 101',
      courseTitle: 'General African Studies & Communication Skills',
      fileName: `GNS_${level > 200 ? '201' : '101'}_Course_Pack.pdf`,
      fileSize: '2.1 MB',
      category: 'course_materials',
      semester: 'Second Semester',
      year: '2024/2025',
      uploadedBy: 'FUNAAB General Studies Unit',
      verified: true,
      downloads: 654,
      previewSnippet: `GENERAL STUDIES MODULE: Critical reading, logical deductions, library science, reference citations (APA 7th edition), and academic writing structures.`,
    },

    // 2. PAST QUESTIONS
    {
      id: `${prefix.toLowerCase()}-${level}-pq-1`,
      title: `${prefix} ${level}1 - 2023/2024 First Semester Examination Paper`,
      courseCode: `${prefix} ${level}1`,
      courseTitle: `${departmentName} First Semester Finals`,
      fileName: `${prefix}_${level}1_Exam_2023_2024.pdf`,
      fileSize: '1.2 MB',
      category: 'past_questions',
      semester: 'First Semester',
      year: '2023/2024',
      uploadedBy: 'Academic Vault Archivist',
      verified: true,
      downloads: 870,
      previewSnippet: `FEDERAL UNIVERSITY OF AGRICULTURE, ABEOKUTA\nDEPARTMENT OF ${departmentName.toUpperCase()}\nTIME ALLOWED: 2 Hours 30 Minutes\nINSTRUCTIONS: Answer Question 1 (Compulsory) and any other THREE questions. Show all working clearly.`,
    },
    {
      id: `${prefix.toLowerCase()}-${level}-pq-2`,
      title: `${prefix} ${level}1 - 2022/2023 First Semester Examination Paper`,
      courseCode: `${prefix} ${level}1`,
      courseTitle: `${departmentName} Past Examination Set`,
      fileName: `${prefix}_${level}1_Exam_2022_2023.pdf`,
      fileSize: '1.4 MB',
      category: 'past_questions',
      semester: 'First Semester',
      year: '2022/2023',
      uploadedBy: 'Course Rep Archives',
      verified: true,
      downloads: 640,
      previewSnippet: `FEDERAL UNIVERSITY OF AGRICULTURE, ABEOKUTA\nEXAMINATION SESSION 2022/2023\nSECTION A: Multiple Choice & Conceptual Questions (30 Marks)\nSECTION B: In-depth Proofs & Problem Solving (70 Marks).`,
    },
    {
      id: `${prefix.toLowerCase()}-${level}-pq-3`,
      title: `${prefix} ${level}3 - 2021-2024 Compiled Mid-Semester Test Archive`,
      courseCode: `${prefix} ${level}3`,
      courseTitle: `${departmentName} Continuous Assessments`,
      fileName: `${prefix}_${level}3_Continuous_Assessment_Tests.pdf`,
      fileSize: '2.5 MB',
      category: 'past_questions',
      semester: 'Second Semester',
      year: '2024',
      uploadedBy: 'Student Study Group',
      verified: true,
      downloads: 512,
      previewSnippet: `CONTINUOUS ASSESSMENT ARCHIVE:\n15 Past mid-semester test papers from 2021 to 2024 covering Quiz 1, Quiz 2, and departmental mock examinations.`,
    },

    // 3. SOLUTIONS & ANSWERS TO PAST QUESTIONS
    {
      id: `${prefix.toLowerCase()}-${level}-sol-1`,
      title: `${prefix} ${level}1 - 2023/2024 Detailed Worked Solutions & Guide`,
      courseCode: `${prefix} ${level}1`,
      courseTitle: `Full Solutions for ${prefix} ${level}1 Examination`,
      fileName: `${prefix}_${level}1_Solutions_2023_2024.pdf`,
      fileSize: '3.6 MB',
      category: 'solutions',
      semester: 'First Semester',
      year: '2023/2024',
      uploadedBy: 'Faculty Peer Reviewers',
      verified: true,
      downloads: 1120,
      previewSnippet: `EXAM SOLUTION KEY:\nQuestion 1 Solution: Step-by-step mathematical proof demonstrating principles in ${departmentName}. Includes visual figures, tables, and formula annotations.`,
    },
    {
      id: `${prefix.toLowerCase()}-${level}-sol-2`,
      title: `${prefix} ${level}1 - 2022/2023 Step-by-Step Marking Scheme & Explanations`,
      courseCode: `${prefix} ${level}1`,
      courseTitle: `Official Marking Scheme & Answer Keys`,
      fileName: `${prefix}_${level}1_Marking_Scheme_2023.pdf`,
      fileSize: '2.9 MB',
      category: 'solutions',
      semester: 'First Semester',
      year: '2022/2023',
      uploadedBy: 'Departmental Tutor Guild',
      verified: true,
      downloads: 935,
      previewSnippet: `MARKING SCHEME BREAKDOWN:\nDetailed breakdown of points allocated per step, common student misconceptions, and examiner commentary highlighting optimal problem-solving approaches.`,
    },
    {
      id: `${prefix.toLowerCase()}-${level}-sol-3`,
      title: `${prefix} ${level} - 5-Year Past Questions Solved Master Pack`,
      courseCode: `${prefix} ${level}0`,
      courseTitle: `Comprehensive Departmental Answer Vault`,
      fileName: `${prefix}_${level}_Master_Solved_Vault.pdf`,
      fileSize: '6.2 MB',
      category: 'solutions',
      semester: 'First Semester',
      year: '2024 Edition',
      uploadedBy: 'Senior Academic Committee',
      verified: true,
      downloads: 1450,
      previewSnippet: `MASTER SOLVED PACK:\nOver 50 examination questions solved with verified answer explanations, formula index, and revision summaries for final exams.`,
    },
  ];
}
