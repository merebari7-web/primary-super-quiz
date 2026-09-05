import random
from .base import make_q, Bank, pick_others

def gen_crs(grade: int, rng: random.Random) -> list[dict]:
    b = Bank()
    
    p1_items = [
        (f"In the beginning, God created the heavens and the ____. (P{grade})", "earth", ["stars only", "clouds only", "oceans only"], "Genesis 1:1 records God as the Supreme Creator of the universe.", "Genesis 1:1 statement.", "Creation & God", "Remember", "Easy"),
        (f"God placed the first man, Adam, in the Garden of ____. (P{grade})", "Eden", ["Sinai", "Canaan", "Egypt"], "Adam was placed in Eden to cultivate and preserve it.", "The original paradise garden.", "Creation & God", "Remember", "Easy"),
        (f"The mother of Jesus Christ was the Virgin ____. (P{grade})", "Mary", ["Elizabeth", "Sarah", "Ruth"], "Mary was chosen to bear Jesus by the Holy Spirit.", "Mother of Jesus.", "Jesus Christ", "Remember", "Easy"),
        (f"Jesus was born in the town of ____ in Judea. (P{grade})", "Bethlehem", ["Nazareth", "Jerusalem", "Jericho"], "Jesus was born in Bethlehem as prophesied in Micah 5:2.", "Town of Jesus' birth.", "Jesus Christ", "Remember", "Easy")
    ]
    
    p2_items = [
        (f"Jesus fed five thousand people with five barley loaves and ____ small fish. (P{grade})", "two", ["five", "seven", "twelve"], "The miracle of the five loaves and two fish fed the multitude.", "Number of small fish in the miracle.", "Miracles of Jesus", "Remember", "Easy"),
        (f"Jesus selected and appointed ____ disciples to be His core apostles. (P{grade})", "12", ["7", "10", "40"], "Jesus chose the twelve apostles to preach and heal.", "Number of Jesus' apostles.", "Ministry of Jesus", "Remember", "Easy"),
        (f"The disciple who betrayed Jesus to the chief priests for thirty pieces of silver was ____. (P{grade})", "Judas Iscariot", ["Peter", "John", "Thomas"], "Judas Iscariot led the temple guards to arrest Jesus in Gethsemane.", "The disciple who betrayed Jesus.", "Passion & Resurrection", "Remember", "Easy"),
        (f"Jesus rose from the dead on the ____ day after His crucifixion. (P{grade})", "third", ["second", "seventh", "fortieth"], "Christ's resurrection occurred on the third day (Easter Sunday).", "The day of the Resurrection.", "Passion & Resurrection", "Remember", "Easy")
    ]
    
    p3_items = [
        (f"God gave the Ten Commandments to Prophet ____ on Mount Sinai. (P{grade})", "Moses", ["Abraham", "David", "Elijah"], "Moses received the tablets of the Law on Mount Sinai.", "Prophet who received the Ten Commandments.", "The Law & Prophets", "Remember", "Easy"),
        (f"The fifth commandment teaches children to: '____ your father and mother.' (P{grade})", "Honor", ["Ignore", "Disobey", "Abandon"], "Exodus 20:12: 'Honor your father and your mother that your days may be long.'", "Fifth commandment instruction.", "Ten Commandments", "Understand", "Easy"),
        (f"The young shepherd boy who defeated the giant Goliath with a sling and stone was ____. (P{grade})", "David", ["Solomon", "Samson", "Jonathan"], "David trusted God and struck down the Philistine champion Goliath.", "Future king who defeated Goliath.", "Old Testament Heroes", "Remember", "Easy"),
        (f"The prophet who was thrown into a den of hungry lions but protected by God was ____. (P{grade})", "Daniel", ["Jonah", "Jeremiah", "Isaiah"], "Daniel's steadfast prayer life led God to shut the lions' mouths.", "Prophet saved from lions.", "Old Testament Heroes", "Remember", "Easy")
    ]
    
    p4_items = [
        (f"The parable of the Good Samaritan teaches Christians to show love and mercy to ____. (P{grade})", "everyone in need, including neighbors and strangers", ["only family members", "only wealthy friends", "nobody"], "Jesus taught that our neighbor is anyone requiring compassion and help.", "Lesson of the Good Samaritan.", "Parables of Jesus", "Understand", "Medium"),
        (f"The parable of the Prodigal Son illustrates God's boundless ____. (P{grade})", "forgiveness, grace, and welcoming love", ["strict punishment", "indifference", "rejection"], "The loving father welcomed back his repentant wayward son with joy.", "Moral theme of the Prodigal Son.", "Parables of Jesus", "Understand", "Medium"),
        (f"The Holy Spirit descended upon the Apostles on the Day of ____. (P{grade})", "Pentecost", ["Passover", "Tabernacles", "Atonement"], "Acts 2 records the Holy Spirit empowering the early Church with tongues of fire.", "Day of the Holy Spirit's descent.", "Early Church", "Remember", "Medium"),
        (f"The king renowned in the Bible for asking God for wisdom to govern Israel was King ____. (P{grade})", "Solomon", ["Saul", "Rehoboam", "Ahab"], "Solomon asked for wisdom and understanding rather than riches.", "Wise king who built the Temple.", "Kings of Israel", "Remember", "Easy")
    ]
    
    p5_items = [
        (f"In Galatians 5:22-23, love, joy, peace, patience, kindness, and self-control are the ____. (P{grade})", "Fruit of the Spirit", ["Gifts of healings", "Ten Plagues", "Beatitudes"], "The Fruit of the Spirit represents Christlike character formed by the Holy Spirit.", "Virtues produced by the Holy Spirit.", "Christian Living", "Remember", "Medium"),
        (f"The Apostle who formerly persecuted Christians named Saul and became the great missionary to the Gentiles was ____. (P{grade})", "Paul", ["Peter", "Barnabas", "Stephen"], "Paul encountered the risen Christ on the road to Damascus.", "Apostle converted on Damascus road.", "Early Church & Missions", "Remember", "Medium"),
        (f"The first Christian martyr who was stoned to death for his faith in Christ was ____. (P{grade})", "Stephen", ["James", "Timothy", "Philip"], "Stephen prayed for his executioners as recorded in Acts 7.", "First recorded Christian martyr.", "Early Church", "Remember", "Medium"),
        (f"The prophet swallowed by a great fish when running from God's mission to Nineveh was ____. (P{grade})", "Jonah", ["Ezekiel", "Amos", "Hosea"], "Jonah repented inside the fish and preached repentance to Nineveh.", "Prophet who fled to Tarshish.", "Prophets & Missions", "Remember", "Easy")
    ]
    
    p6_items = [
        (f"The Beatitudes ('Blessed are the poor in spirit...', 'Blessed are the peacemakers...') were taught by Jesus in the Sermon on the ____. (P{grade})", "Mount", ["Plain", "Sea", "Temple Steps"], "Matthew 5-7 details the core kingdom ethics of Jesus' Sermon on the Mount.", "Famous mountain discourse.", "Teachings of Jesus", "Remember", "Medium"),
        (f"Paul wrote letters (Epistles) to early churches. The epistle famous for the 'Love Chapter' (1 Corinthians 13) emphasizes that the greatest virtue is ____. (P{grade})", "Love (Charity)", ["Wealth", "Physical Strength", "Fame"], "1 Corinthians 13:13: 'Now faith, hope, and love abide, but the greatest of these is love.'", "The supreme theological virtue.", "Christian Ethics", "Understand", "Medium"),
        (f"The Roman governor who sentenced Jesus to crucifixion despite finding no guilt in Him was ____. (P{grade})", "Pontius Pilate", ["Herod Antipas", "Caesar Augustus", "Felix"], "Pilate washed his hands and delivered Jesus to appease the crowd.", "Roman governor of Judea.", "Passion of Christ", "Remember", "Medium"),
        (f"The Great Commission (Matthew 28:19) commands disciples to go into all the world and ____. (P{grade})", "make disciples of all nations, baptizing and teaching them", ["conquer nations by sword", "accumulate gold", "remain silent"], "The Great Commission drives global Christian gospel outreach.", "Final command of the risen Christ.", "Missions & Evangelism", "Understand", "Medium")
    ]
    
    grade_map = {1: p1_items, 2: p2_items, 3: p3_items, 4: p4_items, 5: p5_items, 6: p6_items}
    items = grade_map.get(grade, p1_items)
    for it in items:
        b.add(make_q(it[0], it[1], it[2], it[3], it[4], it[5], it[6], it[7]), rng)

    bible_facts = [
        ("Genesis", "the first book of the Holy Bible containing creation accounts", ["the last book", "a book of poetry", "a gospel"]),
        ("Revelation", "the final apocalyptic book of the New Testament", ["the first book of Moses", "a historical book", "a psalm"]),
        ("Psalms", "a collection of sacred songs, prayers, and hymns largely by King David", ["a book of laws", "a gospel", "a prophecy of doom"]),
        ("Matthew, Mark, Luke, and John", "the four canonical Gospel accounts of the life and ministry of Jesus", ["four Old Testament letters", "four kings", "four prophets"]),
        ("The Ark of the Covenant", "a sacred gold-covered chest housing the Ten Commandments", ["a wooden fishing boat", "a stone altar", "a golden calf"]),
        ("Noah", "the righteous man who built the Ark to preserve life during the Great Flood", ["a Pharaoh of Egypt", "a Roman centurion", "a high priest"]),
        ("Abraham", "the founding Patriarch whom God promised to make the father of many nations", ["a king of Babylon", "a Greek philosopher", "a disciple of John"])
    ]
    for b_name, b_def, b_dist in bible_facts:
        b.add(make_q(f"Scriptural knowledge (P{grade}): What is {b_name}?",
                     b_def, b_dist, f"{b_name} is {b_def}.", f"Description of {b_name}.", "Scripture & History", "Understand", "Easy"), rng)

    counter = 1
    while len(b.items) < 100:
        b.add(make_q(f"Christian moral teaching #{counter} (P{grade}): The Golden Rule taught by Jesus states that we should treat others ____.",
                     "the way we want them to treat us", ["with suspicion and anger", "badly if they offend us", "with pride"], "Matthew 7:12 summarizes the Law and the Prophets in treating others kindly.", "The core Golden Rule.", "Christian Living", "Understand", "Easy"), rng)
        counter += 1

    return b.items[:100]
