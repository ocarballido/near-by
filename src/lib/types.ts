export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			todo_list: {
				Row: {
					created_at: string;
					description: string | null;
					done: boolean;
					done_at: string | null;
					id: number;
					owner: string;
					title: string;
					urgent: boolean;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					done?: boolean;
					done_at?: string | null;
					id?: number;
					owner: string;
					title: string;
					urgent?: boolean;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					done?: boolean;
					done_at?: string | null;
					id?: number;
					owner?: string;
					title?: string;
					urgent?: boolean;
				};
				Relationships: [];
			};
			properties: {
				Row: {
					id: string;
					owner: string;
					name: string;
					description?: string | null;
					address: string;
					latitude: number;
					longitude: number;
					image_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Insert: {
					id?: string;
					owner: string;
					name: string;
					description?: string | null;
					address: string;
					latitude: number;
					longitude: number;
					image_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					owner?: string;
					name?: string;
					description?: string | null;
					address?: string;
					latitude?: number;
					longitude?: number;
					image_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			location_groups: {
				Row: {
					id: string;
					property_id: string;
					category_id: string;
					name: string;
					slug: string;
					order_index: number;
					created_at?: string;
					updated_at?: string;
				};
				Insert: {
					id?: string;
					property_id: string;
					category_id: string;
					name: string;
					slug: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					property_id?: string;
					category_id?: string;
					name?: string;
					slug?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			property_info: {
				Row: {
					id: string;
					property_id: string;
					category_id: string;
					title: string;
					content: string;
					created_at?: string;
					updated_at?: string;
				};
				Insert: {
					id?: string;
					property_id: string;
					category_id: string;
					title: string;
					content: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					property_id?: string;
					category_id?: string;
					title?: string;
					content?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			locations: {
				Row: {
					id: string;
					group_id: string;
					name: string;
					description: string;
					address: string;
					latitude: number;
					longitude: number;
					image_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Insert: {
					id?: string;
					group_id: string;
					name: string;
					description?: string | null;
					address: string;
					latitude: number;
					longitude: number;
					image_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					group_id?: string;
					name?: string;
					description?: string | null;
					address?: string;
					latitude?: number;
					longitude?: number;
					image_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			categories: {
				Row: {
					id: string;
					name: string;
					order_index: number;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
			PublicSchema['Views'])
	? (PublicSchema['Tables'] &
			PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
	? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
	: never;

export type IconKey =
	| 'IconAccountCircle'
	| 'IconAdd'
	| 'IconApartment'
	| 'IconArrowLeftAlt'
	| 'IconArrowRightAlt'
	| 'IconBorderColor'
	| 'IconCancel'
	| 'IconChatBubble'
	| 'IconCheck'
	| 'IconCheckCircle'
	| 'IconChevronBackward'
	| 'IconChevronForward'
	| 'IconClose'
	| 'IconComedyMask'
	| 'IconDelete'
	| 'IconDeleteForever'
	| 'IconDirections'
	| 'IconEmergency'
	| 'IconEdit'
	| 'IconError'
	| 'IconFamilyRestroom'
	| 'IconForkSpoon'
	| 'IconHealing'
	| 'IconHelp'
	| 'IconHome'
	| 'IconInfo'
	| 'IconInterests'
	| 'IconKeyboardArrowDown'
	| 'IconKeyboardArrowUp'
	| 'IconLanguage'
	| 'IconLocalAtm'
	| 'IconLocalDining'
	| 'IconLocationOn'
	| 'IconLogout'
	| 'IconMap'
	| 'IconMenu'
	| 'IconMuseum'
	| 'IconNature'
	| 'IconNewRelease'
	| 'IconNightLife'
	| 'IconOpenInNew'
	| 'IconPersonAdd'
	| 'IconPets'
	| 'IconSearch'
	| 'IconShoppingBag'
	| 'IconTrain';

export interface SidebarMenuItemConfig {
	label: string;
	url: string;
	icon: IconKey;
}

// types/sidebar.ts

export type SubCategory = {
	id: string;
	name: string;
	type: string;
};

export type CategoryWithSubCategories = {
	id: string;
	name: string;
	icon: string | null;
	order_index: number;
	type: 'info' | 'location';
	sub_categories: SubCategory[];
};

// src/lib/types.ts

// lib/types.ts
export interface PropertyLocation {
	id: string;
	name: string;
	address: string;
	latitude?: number;
	longitude?: number;
	image_url?: string;
	description?: string;
	featured?: boolean;
	type?: 'info' | 'location';
}
