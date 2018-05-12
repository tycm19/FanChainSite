import psycopg2
import requests
import json


TEAMS_URL = "https://statsapi.web.nhl.com/api/v1/teams/"
ROSTER_URL = "https://statsapi.web.nhl.com/api/v1/teams/#/roster";
SALARY_URL = "https://statsapi.web.nhl.com/api/v1/people/#/stats?stats=statsSingleSeason&season=20162017";
IMAGE_URL = "https://nhl.bamcontent.com/images/headshots/current/168x168/#.jpg"
PLAYER_INSERT_QUERY = "INSERT INTO playersdata(id, firstname, lastname, position, projectedscore, salary, image) VALUES(%s, %s, %s, %s, %s, %s, %s);"


def get_all_teams():
    team_ids = []
    r = requests.get(TEAMS_URL)
    for team in r.json()["teams"]:
        team_ids.append(team["id"]);

    return team_ids


def get_player_for_team(conn, team_id):
    cur = conn.cursor()
    r = requests.get(ROSTER_URL.replace("#", str(team_id)))
    for player in r.json()["roster"]:
        # Get player_id
        player_id = player["person"]["id"]

        # Get player name
        fullname = player["person"]["fullName"].split(" ")
        firstname = " ".join(fullname[0:-1])
        lastname = fullname[-1]
        projectedscore = 0;
        # Get player position
        position = player["position"]["code"]

        # Calculate player's salary
        r = requests.get(SALARY_URL.replace("#", str(player_id)))
        try:
            stat = r.json()["stats"][0]["splits"][0]["stat"]                 
            if position in ["C", "L", "R", "D"]:
                evg = stat["goals"] - stat["powerPlayGoals"] - stat["shortHandedGoals"]
                fantasy_score = (stat["assists"] * 5 + evg * 7 + stat["powerPlayGoals"] * 8 +stat["shortHandedGoals"] * 10 + stat["shots"] + stat["hits"] + stat["blocked"]) / stat["games"]
            else:
                fantasy_score = (stat["saves"] - stat["goalsAgainst"] * 5 +stat["shutouts"] * 10) / stat["games"]                
            salary = max(400, round(100 * fantasy_score))
            projectedscore = fantasy_score
        except Exception as e:
            #print(e)
            salary = 600;

        # Get player image
        r = requests.get(IMAGE_URL.replace("#", str(player_id)))
        if r.status_code != 200:
            r = requests.get(IMAGE_URL.replace("#", "skater"))
        image = psycopg2.Binary(r.content)

        # Insert into database
        try:
            cur.execute(PLAYER_INSERT_QUERY, (player_id, firstname, lastname, position, projectedscore, salary, image))
            print("{} success".format(player_id))
        except Exception as e:
            conn.commit()
            print("{} failed: {}".format(player_id, e))
            cur = conn.cursor()

    conn.commit()


# Connect to the database
config = json.loads(open("databaseConfig.json", "r").read())
conn = psycopg2.connect(**config)

team_ids = get_all_teams()
for team_id in team_ids:
    get_player_for_team(conn, team_id)

# Close the connection to the database
conn.close()