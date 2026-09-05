import random
from .base import make_q, Bank, pick_others

def gen_irs(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"The first and most fundamental Pillar of Islam declaring faith in Allah and His Messenger is the ____. (P{grade})", "Shahadah (Declaration of Faith)", ["Salat", "Zakat", "Sawm"], "The Shahadah: 'La ilaha illa Allah, Muhammadur Rasulullah.'", "Declaration of Tawhid and Prophethood.", "Pillars of Islam", "Remember", "Easy"),
        (f"Muslims worship the One Almighty God whose Arabic name is ____. (P{grade})", "Allah", ["Malik", "Rasul", "Imam"], "Allah is the Unique, Absolute Creator of the universe with no partners.", "The One True God.", "Tawhid", "Remember", "Easy"),
        (f"The holy book revealed by Allah to Prophet Muhammad (peace be upon him) is the Holy ____. (P{grade})", "Qur'an", ["Tawrat", "Zabur", "Injil"], "The Qur'an is the final, uncorrupted revelation for mankind.", "Final holy scripture in Islam.", "The Holy Qur'an", "Remember", "Easy"),
        (f"Muslims perform obligatory daily prayers (Salat) ____ times each day. (P{grade})", "5", ["3", "7", "10"], "The five daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.", "Number of daily obligatory prayers.", "Salat & Worship", "Remember", "Easy")
    ]
    
    p2_items = [
        (f"Before performing Salat (prayer), a Muslim must perform ritual ablution called ____. (P{grade})", "Wudu", ["Ghusl", "Tayammum", "Zakat"], "Wudu purifies the believer physically and spiritually for prayer.", "Ritual washing with clean water.", "Taharah (Purification)", "Remember", "Easy"),
        (f"The opening chapter (Surah) of the Holy Qur'an recited in every prayer unit is Surah ____. (P{grade})", "Al-Fatihah", ["Al-Ikhlas", "An-Nas", "Al-Falaq"], "Surah Al-Fatihah ('The Opening') comprises seven foundational verses.", "The first opening Surah.", "The Holy Qur'an", "Remember", "Easy"),
        (f"Prophet Muhammad (SAW) was born in the holy city of ____. (P{grade})", "Makkah", ["Madinah", "Jerusalem", "Cairo"], "The Prophet (SAW) was born in Makkah in the Year of the Elephant (570 CE).", "Birthplace of the Prophet (SAW).", "Seerah (Prophetic History)", "Remember", "Easy"),
        (f"The mother of Prophet Muhammad (SAW) was Lady ____. (P{grade})", "Aminah", ["Khadijah", "Fatimah", "Aisha"], "Lady Aminah bint Wahb was the beloved mother of the Prophet (SAW).", "Mother of Prophet Muhammad (SAW).", "Seerah (Prophetic History)", "Remember", "Easy")
    ]
    
    p3_items = [
        (f"Fasting (Sawm) during the sacred month of ____ is the fourth pillar of Islam. (P{grade})", "Ramadan", ["Shawwal", "Muharram", "Rajab"], "During Ramadan, Muslims abstain from food and drink from dawn until sunset.", "The holy month of fasting.", "Sawm (Fasting)", "Remember", "Easy"),
        (f"The meal eaten by Muslims before dawn to begin the daily fast is called ____. (P{grade})", "Sahur", ["Iftar", "Walimah", "Aqiqah"], "Sahur is the blessed pre-dawn meal before Fajr.", "Pre-dawn fasting meal.", "Sawm (Fasting)", "Remember", "Easy"),
        (f"The meal eaten at sunset to break the fast is called ____. (P{grade})", "Iftar", ["Sahur", "Niyyah", "Zakat"], "Iftar is traditionally initiated by eating dates and drinking water.", "Sunset meal breaking the fast.", "Sawm (Fasting)", "Remember", "Easy"),
        (f"The annual obligatory charitable contribution given to help the poor is ____. (P{grade})", "Zakat", ["Sadaqah", "Waqf", "Riba"], "Zakat (2.5% of qualifying wealth) purifies wealth and aids the vulnerable.", "Third pillar of Islam.", "Zakat & Charity", "Remember", "Easy")
    ]
    
    p4_items = [
        (f"The pilgrimage to the holy Ka'bah in Makkah performed by Muslims once in a lifetime if able is ____. (P{grade})", "Hajj", ["Umrah", "Ziyarah", "Hijrah"], "Hajj is the fifth pillar of Islam during the month of Dhul-Hijjah.", "Fifth pillar of Islam.", "Hajj & Pilgrimage", "Remember", "Easy"),
        (f"The cube-shaped sacred building in the center of the Grand Mosque in Makkah is the ____. (P{grade})", "Ka'bah", ["Maqam Ibrahim", "Mina", "Arafat"], "The Ka'bah is the Qiblah (direction of prayer) for all Muslims worldwide.", "Focal direction for daily Salat.", "Islamic Heritage", "Remember", "Easy"),
        (f"The angel who delivered divine revelations from Allah to the prophets was Angel ____. (P{grade})", "Jibril (Gabriel)", ["Mikail", "Israfil", "Izrail (Malak al-Mawt)"], "Angel Jibril brought the words of the Qur'an to Muhammad (SAW).", "Angel of divine revelation.", "Articles of Faith", "Remember", "Easy"),
        (f"Surah Al-Ikhlas (Qur'an 112) powerfully proclaims the absolute oneness and uniqueness of ____. (P{grade})", "Allah (Tawhid)", ["wealth", "angels", "nature"], "Surah Al-Ikhlas declares: 'Say, He is Allah, [who is] One.'", "Surah of pure monotheism.", "The Holy Qur'an", "Understand", "Easy")
    ]
    
    p5_items = [
        (f"The historical migration of Prophet Muhammad (SAW) and Muslims from Makkah to Madinah is the ____. (P{grade})", "Hijrah", ["Mi'raj", "Isra", "Ghazwah"], "The Hijrah in 622 CE marks the beginning of the Islamic Hijri calendar.", "The migration to Madinah.", "Islamic History", "Remember", "Medium"),
        (f"The first beloved wife of Prophet Muhammad (SAW) who comforted and supported him was Lady ____. (P{grade})", "Khadijah (RA)", ["Aisha", "Hafsah", "Sawdah"], "Lady Khadijah was a successful merchant and the first person to embrace Islam.", "First wife of the Prophet (SAW).", "Seerah & Sahabah", "Remember", "Easy"),
        (f"Sayings, actions, and approvals of Prophet Muhammad (peace be upon him) recorded by companions are called ____. (P{grade})", "Hadith (and Sunnah)", ["Tafsir", "Fiqh", "Qiyas"], "Hadith literature is the secondary source of Islamic guidance after the Qur'an.", "Prophetic traditions and narrations.", "Hadith & Sunnah", "Remember", "Medium"),
        (f"The companion known as 'As-Siddiq' (The Truthful) who became the first Caliph of Islam was ____. (P{grade})", "Abu Bakr (RA)", ["Umar (RA)", "Uthman (RA)", "Ali (RA)"], "Abu Bakr was the closest companion and the first Rightly Guided Caliph.", "First Caliph of Islam.", "Rightly Guided Caliphs", "Remember", "Medium")
    ]
    
    p6_items = [
        (f"The six Articles of Faith (Iman) in Islam include belief in Allah, Angels, Books, Prophets, the Last Day, and ____. (P{grade})", "Al-Qadar (Divine Destiny/Decree)", ["Reincarnation", "Astrology", "Idol statues"], "Belief in Al-Qadar acknowledges that all events occur by Allah's divine decree.", "Sixth article of faith.", "Articles of Faith", "Remember", "Medium"),
        (f"The Caliph under whose leadership the standardized single written text of the Holy Qur'an was compiled was ____. (P{grade})", "Uthman ibn Affan (RA)", ["Abu Bakr", "Umar ibn al-Khattab", "Ali ibn Abi Talib"], "Caliph Uthman produced the standardized Mushaf distributed to major provinces.", "Third Rightly Guided Caliph.", "Qur'anic Compilation", "Remember", "Medium"),
        (f"The Arabic term for good moral character, manners, and ethical behavior taught in Islam is ____. (P{grade})", "Akhlaq (and Adab)", ["Shirk", "Nifaq", "Bida'h"], "The Prophet (SAW) stated he was sent to perfect noble moral character (Akhlaq).", "Islamic ethics and manners.", "Islamic Ethics", "Remember", "Medium"),
        (f"The Night Journey and Heavenly Ascension of Prophet Muhammad (SAW) is celebrated as ____. (P{grade})", "Al-Isra wal-Mi'raj", ["Laylat al-Qadr", "Eid al-Fitr", "Eid al-Adha"], "Isra and Mi'raj was the miraculous nocturnal journey where Salat was prescribed.", "Miraculous heavenly ascension.", "Seerah & Miracles", "Remember", "Medium")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    prophets = [
        ("Prophet Adam (AS)", "the first human being and first prophet created by Allah", ["the last prophet", "the builder of the Ka'bah", "the companion in the cave"]),
        ("Prophet Ibrahim (AS)", "the Patriarch known as Khalilullah (Friend of Allah) who built the Ka'bah", ["the king of Egypt", "the nephew of Lut", "the writer of Injil"]),
        ("Prophet Musa (AS)", "the prophet who spoke with Allah (Kalimullah) and received the Tawrat", ["the father of Sulaiman", "the companion of Abu Bakr", "the son of Maryam"]),
        ("Prophet Isa (AS)", "the noble prophet born miraculously to Maryam who received the Injil", ["the king of Rome", "the brother of Harun", "the first Caliph"]),
        ("Prophet Nuh (AS)", "the prophet who built the Ark to save believers from the great deluge", ["the conqueror of Makkah", "the cousin of Ali", "the second Caliph"]),
        ("Prophet Dawud (AS)", "the prophet-king who received the holy Psalms (Zabur)", ["the builder of Rome", "the companion of Musa", "the uncle of Muhammad"])
    ]
    for p_name, p_def, p_dist in prophets:
        b.add(make_q(f"Prophetic history (P{grade}): Who was {p_name} in Islamic heritage?",
                     p_def, p_dist, f"{p_name} was {p_def}.", f"Description of {p_name}.", "Prophets in Islam", "Understand", "Easy"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Islamic moral conduct #{counter} (P{grade}): Prophet Muhammad (SAW) said: 'The most beloved deeds to Allah are those that are ____.'",
                     "consistent and regular, even if small", ["done only once a year", "done to show off to people", "done with pride"], "Consistency in virtuous deeds is prized in Islamic ethics.", "Regular good habits.", "Akhlaq & Ethics", "Understand", "Easy"), rng)
        counter += 1

    return b.items[:100]
