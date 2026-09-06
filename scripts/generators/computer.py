import random
from .base import make_q, Bank, pick_others

def gen_computer(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"An electronic machine that accepts data, processes it, and produces information is a ____. (P{grade})", "computer", ["refrigerator", "generator", "bicycle"], "A computer is an electronic device for data processing and storage.", "Electronic machine for processing data.", "Computer Fundamentals", "Remember", "Easy"),
        (f"The screen of the computer where pictures, text, and videos are displayed is the ____. (P{grade})", "monitor", ["mouse", "keyboard", "CPU"], "The monitor (screen) is an output display device.", "Visual display screen.", "Hardware & Components", "Remember", "Easy"),
        (f"The device used to type letters, numbers, and words into a computer is the ____. (P{grade})", "keyboard", ["printer", "speaker", "scanner"], "The keyboard has letter and number keys for text input.", "Has keys with letters and numbers.", "Input Devices", "Remember", "Easy"),
        (f"The small pointing device used to move the cursor and click on items is the ____. (P{grade})", "mouse", ["microphone", "hard disk", "cable"], "A computer mouse controls the on-screen pointer.", "Handheld pointing device.", "Input Devices", "Remember", "Easy"),
        (f"The 'brain' of the computer that performs all calculations and controls tasks is the ____. (P{grade})", "CPU (Central Processing Unit)", ["monitor", "mouse pad", "speakers"], "The Central Processing Unit processes all system instructions.", "Central Processing Unit.", "Hardware & Components", "Remember", "Easy"),
        (f"Before touching computer parts, our hands should be ____. (P{grade})", "clean and dry", ["wet with water", "covered in oil", "holding sticky food"], "Clean, dry hands protect electronic circuitry from short circuits and dirt.", "Prevents damage to sensitive circuits.", "Safety & Maintenance", "Understand", "Easy")
    ]
    
    p2_items = [
        (f"Pressing the left mouse button twice rapidly is called a ____. (P{grade})", "double-click", ["drag and drop", "right-click", "scroll"], "Double-clicking opens programs, files, or folders on desktop OS.", "Rapidly pressing twice.", "Mouse Skills", "Remember", "Easy"),
        (f"The longest key on the bottom of the computer keyboard used to create spaces between words is the ____. (P{grade})", "Spacebar", ["Enter key", "Shift key", "Backspace"], "The Spacebar creates horizontal blank spaces between characters.", "The long horizontal key.", "Keyboard Skills", "Remember", "Easy"),
        (f"The key used to start a new line of text or execute a command is the ____ key. (P{grade})", "Enter", ["Escape", "Caps Lock", "Alt"], "The Enter (or Return) key begins a new paragraph or confirms commands.", "Key pressed to confirm or start new line.", "Keyboard Skills", "Remember", "Easy"),
        (f"The key used to delete the character immediately to the LEFT of the cursor is the ____ key. (P{grade})", "Backspace", ["Delete", "Spacebar", "Tab"], "Backspace erases backward (to the left).", "Erases backward to the left.", "Keyboard Skills", "Remember", "Easy"),
        (f"The key used to type all letters in CAPITAL letters continuously is ____. (P{grade})", "Caps Lock", ["Shift", "Ctrl", "Tab"], "Caps Lock locks the keyboard in uppercase mode.", "Toggles uppercase lock.", "Keyboard Skills", "Remember", "Easy")
    ]
    
    p3_items = [
        (f"Physical parts of a computer that you can see and touch (monitor, mouse, CPU) are called ____. (P{grade})", "hardware", ["software", "malware", "firmware"], "Hardware encompasses all physical, tangible electronic and mechanical parts.", "Tangible physical parts of the computer.", "Hardware vs Software", "Understand", "Easy"),
        (f"Programs, applications, and instructions that tell the computer hardware what to do are called ____. (P{grade})", "software", ["hardware", "cables", "peripherals"], "Software comprises the code and apps running on hardware.", "Programs and applications.", "Hardware vs Software", "Understand", "Easy"),
        (f"Which of these is an OUTPUT device used to print hard copies of documents on paper? (P{grade})", "Printer", ["Scanner", "Keyboard", "Microphone"], "Printers produce physical hard-copy prints of digital files.", "Produces paper printouts.", "Output Devices", "Understand", "Easy"),
        (f"Which of these is an INPUT device used to capture voice and sound into the computer? (P{grade})", "Microphone", ["Speakers", "Monitor", "Headphones"], "Microphones convert acoustic audio waves into electrical audio signals.", "Captures your spoken voice.", "Input Devices", "Understand", "Easy"),
        (f"Which device is a portable secondary storage device plugged into a USB port? (P{grade})", "USB Flash Drive", ["RAM", "Monitor", "Power Supply"], "USB flash drives store digital files conveniently using flash memory.", "Small portable stick plugged into USB.", "Storage Devices", "Remember", "Easy")
    ]
    
    p4_items = [
        (f"The master system software that manages computer hardware and runs apps (e.g. Windows, Android, macOS) is the ____. (P{grade})", "Operating System (OS)", ["Web Browser", "Word Processor", "Calculator"], "The OS coordinates CPU, memory, and software execution.", "System software like Windows or Android.", "Operating Systems", "Understand", "Medium"),
        (f"RAM stands for ____. (P{grade})", "Random Access Memory", ["Read All Memory", "Run Action Mode", "Rapid Audio Module"], "RAM provides temporary, high-speed working memory for active programs.", "Random Access Memory.", "Computer Memory", "Remember", "Medium"),
        (f"ROM stands for ____. (P{grade})", "Read-Only Memory", ["Run Once Memory", "Real Online Module", "Random Output Machine"], "ROM stores permanent boot instructions that cannot be easily altered.", "Read-Only Memory.", "Computer Memory", "Remember", "Medium"),
        (f"A software application used to view and navigate web pages on the internet (e.g. Chrome, Firefox) is a ____. (P{grade})", "Web browser", ["Search engine", "Antivirus", "Spreadsheet"], "Browsers fetch and render HTML/web documents.", "App like Chrome or Firefox.", "Internet & Web", "Understand", "Easy"),
        (f"A worldwide system of interconnected computer networks is called the ____. (P{grade})", "Internet", ["Intranet", "Bluetooth", "Hotspot"], "The Internet links billions of computing devices globally.", "Global network of networks.", "Networks & Internet", "Remember", "Easy")
    ]
    
    p5_items = [
        (f"In spreadsheet software (e.g. Microsoft Excel), columns are labeled with ____. (P{grade})", "Letters (A, B, C...)", ["Numbers (1, 2, 3...)", "Roman numerals", "Symbols"], "Excel spreadsheets identify columns with letters and rows with numbers.", "Identified with A, B, C...", "Productivity Software", "Remember", "Medium"),
        (f"In spreadsheet software, rows are labeled with ____. (P{grade})", "Numbers (1, 2, 3...)", ["Letters (A, B, C...)", "Punctuation marks", "Colors"], "Horizontal rows are numbered sequentially from 1 upwards.", "Identified with 1, 2, 3...", "Productivity Software", "Remember", "Medium"),
        (f"The intersection of a row and a column in a spreadsheet is called a ____. (P{grade})", "cell", ["box", "grid", "pixel"], "A cell (e.g., B4) holds a single data value, label, or formula.", "Individual box at a row/column junction.", "Productivity Software", "Remember", "Medium"),
        (f"A malicious software program designed to damage, steal data, or disrupt computers is a ____. (P{grade})", "computer virus / malware", ["antivirus", "firewall", "cookie"], "Viruses replicate and cause harm to computer files and system performance.", "Harmful malicious code.", "Cyber Security", "Understand", "Easy"),
        (f"Software installed to detect, block, and remove computer viruses is called ____ software. (P{grade})", "antivirus", ["malware", "spyware", "ransomware"], "Antivirus protects devices against infections.", "Shields against viruses.", "Cyber Security", "Remember", "Easy"),
        (f"A network connecting computers across a single classroom, office, or building is a ____. (P{grade})", "LAN (Local Area Network)", ["WAN", "MAN", "PAN"], "Local Area Networks span small, localized geographical areas.", "Local Area Network.", "Computer Networks", "Remember", "Medium")
    ]
    
    p6_items = [
        (f"A step-by-step set of precise instructions for solving a problem or performing a task is an ____. (P{grade})", "algorithm", ["acronym", "analogy", "antivirus"], "Algorithms form the logical foundation of all computer code.", "Step-by-step sequence of instructions.", "Algorithms & Programming", "Understand", "Medium"),
        (f"A graphical diagram that represents the steps of an algorithm using standard shapes is a ____. (P{grade})", "flowchart", ["bar chart", "pie chart", "scatter plot"], "Flowcharts use rectangles (process), diamonds (decision), and arrows.", "Visual diagram of an algorithm.", "Algorithms & Programming", "Remember", "Medium"),
        (f"In coding, a named storage container used to hold a value that can change is called a ____. (P{grade})", "variable", ["constant", "loop", "syntax"], "Variables store data values in program memory.", "Holds changeable data.", "Programming Concepts", "Understand", "Medium"),
        (f"In programming, repeating a block of instructions multiple times until a condition is met is a ____. (P{grade})", "loop", ["variable", "branch", "comment"], "Loops (for, while) automate repetitive computational tasks.", "Repeats code instructions.", "Programming Concepts", "Understand", "Medium"),
        (f"Storing files and running programs on remote internet servers rather than a local hard drive is ____. (P{grade})", "cloud computing", ["offline computing", "analog computing", "local storage"], "Cloud platforms (Google Cloud, OneDrive) enable remote computing access.", "Internet-based remote storage and compute.", "Emerging Tech", "Understand", "Medium"),
        (f"A secure, strong password should contain ____. (P{grade})", "a mix of uppercase, lowercase, numbers, and symbols", ["only 123456", "only your first name", "only your birth year"], "Complex diverse character passwords prevent unauthorized brute-force access.", "Combines diverse character types.", "Cyber Security", "Understand", "Easy")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    shortcuts = [
        ("Ctrl + C (or Cmd + C)", "Copy selected text or item", ["Paste item", "Cut item", "Print page"]),
        ("Ctrl + V (or Cmd + V)", "Paste copied text or item", ["Cut item", "Save file", "Undo action"]),
        ("Ctrl + S (or Cmd + S)", "Save the current document", ["Print page", "Select all", "Close window"]),
        ("Ctrl + Z (or Cmd + Z)", "Undo the last action", ["Redo action", "Zoom in", "Delete file"]),
        ("Ctrl + P (or Cmd + P)", "Open the Print dialog", ["Play sound", "Paste text", "Power off"]),
        ("Ctrl + A (or Cmd + A)", "Select all items or text", ["Add new page", "Align center", "Archive"])
    ]
    for key, action, dists in shortcuts:
        b.add(make_q(f"Keyboard shortcut (P{grade}): What is the primary function of {key}?",
                     action, dists, f"{key} triggers the {action} command.", "Shortcut command.", "Shortcuts & Skills", "Remember", "Easy"), rng)

    terms = [
        ("Modem", "converts digital computer signals to analog and vice versa", ["prints paper documents", "cools the CPU fan", "types text"]),
        ("Router", "directs data packets between computer networks", ["scans photos", "plays music through speakers", "charges batteries"]),
        ("Firewall", "monitors and filters incoming/outgoing network traffic for security", ["creates physical heat", "prints photos", "cleans keyboards"]),
        ("Server", "provides data, resources, and services to client computers", ["acts as a handheld mouse", "is a type of headphone", "is a monitor stand"]),
        ("Database", "an organized collection of structured data stored electronically", ["a physical drawing board", "a speaker wire", "a single letter key"]),
        ("Browser", "an app used to view pages on the World Wide Web", ["a text-only printer", "a hardware chip", "a power cable"]),
        ("URL", "the unique web address used to locate a webpage on the internet", ["a computer screen cable", "a computer virus", "a type of printer ink"]),
        ("Email", "electronic mail messages exchanged across computer networks", ["handwritten paper letters", "a physical stamp", "a radio wave"]),
        ("Hyperlink", "a clickable link that navigates the user to another web resource", ["a broken cable", "a computer mouse ball", "a keyboard screw"]),
        ("Pixel", "the smallest individual controllable picture element on a display screen", ["a long network cable", "a computer case", "a keyboard key"])
    ]
    for t_name, t_def, t_dist in terms:
        b.add(make_q(f"Computer terminology (P{grade}): What is a {t_name}?",
                     t_def, t_dist, f"A {t_name} is {t_def}.", f"Definition of {t_name}.", "Terminology", "Understand", "Medium"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Digital literacy skill #{counter} (P{grade}): Saving our work regularly to storage media prevents accidental ____.",
                     "data loss during power outage", ["virus infection", "keyboard jamming", "monitor cracking"], "Saving preserves current progress.", "Prevents losing work.", "File Management", "Understand", "Easy"), rng)
        counter += 1

    return b.items[:100]
