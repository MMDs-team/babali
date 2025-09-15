from rest_framework import serializers

from bus.models import Travel


class TravelSerializer(serializers.ModelSerializer):
    seat_stat = serializers.SerializerMethodField() 
    cooperative = serializers.SerializerMethodField() 

    org_terminal = serializers.SerializerMethodField() 
    dest_terminal = serializers.SerializerMethodField() 

    class Meta:
        model = Travel
        fields = [
            'travel_id',
            'bus',
            'org_terminal',
            'dest_terminal',
            'cooperative',
            'origin',
            'dest',
            'date_time',
            'price',
            'description',
            'capacity',
            'seat_stat'
        ]

        
    def get_seat_stat(self, obj):
        bus_type = obj.bus.type
        bus_capacity = obj.bus.seat_count
        seat_stat = []

        if bus_type == "vip" or bus_type == 'man-vip':
            seat_stat = [[], [], [{'id': None},], []]

            index = 0
            seat_num = 1
            while seat_num <= bus_capacity:

                # find gender or empty 
                gender = "E" 
                if obj.seat_stat.get(str(seat_num)) != None:
                    gender = obj.seat_stat.get(str(seat_num))['gender']
                
                # add record
                if seat_num == 13:
                        seat_stat[3].insert(0, {'id': seat_num, 'type': gender})

                elif seat_num == 14 and bus_type == "man-vip":
                        seat_stat[3].insert(0, {'id': seat_num, 'type': gender})

                else:
                    seat_stat[index].insert(0, {'id': seat_num, 'type': gender})
                    index += 1
                    
                    if index == 2:
                        index += 1

                    index %= 4
                
                # empty column
                if len(seat_stat[0]) == 4:
                    seat_stat[0].insert(0, {'id': None})
                if len(seat_stat[1]) == 4:
                    seat_stat[1].insert(0, {'id': None})
                
                seat_num += 1
            
        elif bus_type == 'classic':
            seat_stat = [[], [], [{'id': None},], [], []]

            index = 0
            seat_num = 1
            while seat_num <= bus_capacity:

                # find gender or empty 
                gender = "E" 
                if obj.seat_stat.get(str(seat_num)) != None:
                    gender = obj.seat_stat.get(str(seat_num))['gender']
                
                # add record
                if seat_num == 17 or seat_num == 19:
                        seat_stat[3].insert(0, {'id': seat_num, 'type': gender})
                elif seat_num == 18 or seat_num == 20:
                        seat_stat[4].insert(0, {'id': seat_num, 'type': gender})
                else:
                    seat_stat[index].insert(0, {'id': seat_num, 'type': gender})
                    index += 1
                    
                    if index == 2:
                        index += 1

                    index %= 5
                
                # empty column
                if len(seat_stat[0]) == 4:
                    seat_stat[0].insert(0, {'id': None})
                if len(seat_stat[1]) == 4:
                    seat_stat[1].insert(0, {'id': None})
                
                seat_num += 1
        
        return seat_stat 

    def get_org_terminal(self, obj):
        return obj.org_terminal.name

    def get_dest_terminal(self, obj):
        return obj.dest_terminal.name

    def get_cooperative(self, obj):
        return obj.cooperative.name